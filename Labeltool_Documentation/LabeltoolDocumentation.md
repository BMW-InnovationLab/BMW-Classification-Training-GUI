# BMW Labeling tool Documentation

### Steps :

- **Creating the dataset** : SSH to the Labeltool . Go to **/home/labeltool/RCV_ALL/share/** , Create a folder where you'll put your images for labeling. Then go to the labeltool's Cockpit, Create a new topic (Follow the [Creating Dataset Video](./Creatingdataset.mp4))
- **Labeling** : Visit the label tool's address, Select **Image Classification** , Choose your **topic** (dataset) and start classifying ! 
- **Exporting dataset for training** : Visit the labeltool **RCV Cockpit's** address , Select **Labeltool**- **Labeltool Backend** - **Topics** - **your topic** and export the dataset by choosing Classification Images, Check the [exporting video](./exporting_classification_tutorial.mov) for a better understanding and to see how the resulting files should look 
- **Training** : In order to use the dataset with our Classification Training API , create a folder inside the "data" Folder , and place your exported folders there. Run the API and start training !
