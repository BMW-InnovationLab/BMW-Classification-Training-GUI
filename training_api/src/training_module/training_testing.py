import mxnet as mx

from mxnet import gluon, image, init, nd
from DTO.Configuration import Configuration
import os, time, shutil
import numpy as np
from mxnet import autograd as ag
from zipfile import ZipFile


"""
This class is responsible for testing the training

This class is gluonCV specific

"""

class TrainingTesting():
    """ 
    Method to perform testing and validation after training is done

    Input:
    ------
    -Gluoncv model
    -Validation or testing data
    -Context

    Output:
    -------
    -Accuracy : float
    """

    def test(self, net, val_data, ctx):
        metric = mx.metric.Accuracy()
        for i, batch in enumerate(val_data):
            data = gluon.utils.split_and_load(batch[0], ctx_list=ctx, batch_axis=0, even_split=False)
            label = gluon.utils.split_and_load(batch[1], ctx_list=ctx, batch_axis=0, even_split=False)
            outputs = [net(X) for X in data]
            metric.update(label, outputs)

        return metric.get()
    """
    Method that trains the model

    Input:
    ------
    -train_data:data for training
    -val_data:data for validation
    -test_data:data for testing
    -trainer: gluon trainer
    -metric
    -L : loss 
    -configuration object

    """
    def training_loop(self,model_name, train_data, val_data, test_data, trainer, metric, L, config: Configuration, net, ctx):
        new_model_path = '/checkpoints/'+config.weights_name+'/'+model_name
        lr_counter = 0
        num_batch = len(train_data)
        lr_steps = [10, 20, 30, np.inf]
        batch_size = config.batch_size * max(len(config.gpus_count), 1)
        
        best_acc = 0
        model_name_writer=open(new_model_path+'/networkname.txt','w')
        model_name_writer.write(config.weights_name)
        model_name_writer.close()
        for epoch in range(config.epochs):
            if epoch == lr_steps[lr_counter]:
                trainer.set_learning_rate(trainer.learning_rate * config.lr_factor)
                lr_counter += 1

            tic = time.time()
            train_loss = 0
            metric.reset()

            for i, batch in enumerate(train_data):

                data = gluon.utils.split_and_load(batch[0], ctx_list=ctx, batch_axis=0, even_split=False)
                label = gluon.utils.split_and_load(batch[1], ctx_list=ctx, batch_axis=0, even_split=False)
                with ag.record():

                    outputs = [net(X) for X in data]

                    loss = [L(yhat, y) for yhat, y in zip(outputs, label)]

                for l in loss:
                    
                    l.backward()

                trainer.step(batch_size)

                train_loss += sum([l.mean().asscalar() for l in loss]) / len(loss)

                metric.update(label, outputs)
          
            _, train_acc = metric.get()
            train_loss /= num_batch

            _, val_acc = self.test(net, val_data, ctx)

            print('[Epoch %d] Train-acc: %.3f, loss: %.3f | Val-acc: %.3f | time: %.1f' %
                  (epoch, train_acc, train_loss, val_acc, time.time() - tic),flush=True)

            if (train_acc > best_acc):
                best_acc = train_acc
                net.save_parameters(new_model_path + '/' + model_name + '.params')
                net.export(new_model_path + '/' + model_name)

        _, test_acc = self.test(net, test_data, ctx)
        print('[Finished] Test-acc: %.3f' % (test_acc),flush=True)
        for ctx1 in ctx:
            ctx1.empty_cache()
        # os.remove('../scripts/configuration.json')

        servable_folder_path = os.path.join('/servable',config.weights_name)
        if not os.path.exists(servable_folder_path):
            os.makedirs(servable_folder_path, exist_ok=True)




        with ZipFile(os.path.join(servable_folder_path, model_name+".zip"), 'w') as zipObj:
            for filename in os.listdir(new_model_path):
               filePath = os.path.join(os.path.join(new_model_path, filename))
               zipObj.write(filePath)
        

        inference_model_path = os.path.join('/models', model_name)
        if os.path.exists(inference_model_path):
            shutil.rmtree(inference_model_path)

        os.makedirs(inference_model_path)
        shutil.copytree(new_model_path, inference_model_path)
