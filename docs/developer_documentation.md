# Developer Documentation

*This document is dedicated for developers trying to integrate their code in the training template.*<br>
*It will provide explanations on:<br>*
* *The dockerization process*
* *The core concepts the template was based on*
* *The naming conventions*

---
## Dockerization

1) Add all the needed python packages to the **requirements.txt** file. (can be found in the root directory of the template).<br>
It is always preferred to add an exact version to the package to avoid problems due to updates in the future.<br>
In order to add an exact version, simply write == then the version number.<br>
For example: `somepackage==1.0`

2) Write your dockerfile by following the template **Dockerfile** provided in the root directory of the template. 
<br>
<br>
<br>

## Core Concepts
*In this section we will present the main concepts behind the template <br> Implementation details can be found in the in-code documentation*

### Modules
Training computer vision models often requires a lot of steps and a lot of scripts get involved<br>
The idea behind a module is to group differnet classes and functions serving the same purpose into one bigger entity.<br>
Each module is responsible for one part of the training pipeline.
<br>
<br>


### Facades
Every module has its own facade class. A facade serves as an interface between modules and between a module and the main.<br>
A Facade hides the details of the module and provides a simplified view of it which is easy to use.<br>
This is extremely helpful because it will allow changes inside one module without affecting the whole solution.
<br>
<br>


### DTO
A data transfer object or DTO is a class that has no internal functions. It serves as a medium to carry data between modules as well as from outside the system to the inside.
<br>
<br>
<br>

## Naming Conventions
The naming conventions used in this template is the standard python naming convention: <br>

* **variables and filenames**: Should be meaningful. Use lower case and seperate word by underscores ( **_** )

* **classes names**: Pascal case. (Words are not seperated and each one word starts with capital ex: **SomeExample**)

* **abstract classes**: The filenames and class names of abstract clases follow the same rules as filenames and classes names of regular classes. <br>The difference is that the filenames should start with the word **base** (ex: **base_filename.py**)<br>
Classes names should start with the word **Abstract** (ex:**AbstractClassName**)



 









