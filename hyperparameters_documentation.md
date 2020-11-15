# Hyperparameters Definition

- learning rate : learning rate (used for training) (default value: lr=0.001)
- momentum : momentum (used for training) (default value: momentum=0.9)
- weight decay : weight-decay (used for training) (default value: wd=0.0001)
- learning rate factor: learning rate factor (used for training) (default value: lr_factor=0.75)
- number of workers : number of workers (used for training) (default value: num_workers= 8 )
- jitte: jitter (used for data augmentation) (default value: jitter_param=0.4)
- lighting : lighting (used for data augmentation) (default value: lighting_param=0.1)
- Xavier : true or false (used for weights initialization) (default value : Xavier=true)
- MSRAPrelu : true or false (used for weights initialization) (default value: MSRAPrelu=false)
- batch size per device : batch size (used for training) (default value: batch_size=1)
- epochs : epochs (used for training) (default value: epochs=3)
- Data Augmenting: decides wether to augment the data using our custom data_augmentation funtion or not ( default value: data_augmenting="True")