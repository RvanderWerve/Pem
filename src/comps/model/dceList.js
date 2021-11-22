import { pemFirestore } from "./firebase/config";

class DceList {//Object representing a list of dce's. All dce's from a user will be created from this object
    constructor(user) {
        this.uid=user.uid;
        this.list = [];

        this.nameList=function(){//Namelist used to check if a new dce name is unique
           let names = [];
           this.list.forEach(dce=>names.push(dce.name));
           return names;
            }

        this.deleteDce = (dce) =>{//Function for deleting a dce from the list and the database
            let dceId = dce.id;
            let dceIndex = this.list.findIndex(dce=>dce.id===dceId);
            this.list.splice(dceIndex, 1); //delete dce from dceList
            this.clearCollection(dceId, 'Scenarios'); //clear scenarios from db
            this.clearCollection(dceId, 'AspectList'); //clear aspects from db
            this.clearCollection(dceId, 'RawResults'); //clear results from db
            pemFirestore.collection('users').doc(this.uid).collection('DceList').doc(dceId.toString()).delete()
            .then(() => { console.log("Document with ID"+dceId+ "  successfully deleted!");
                        })
            .catch((error) => { console.error("Error removing document: ", error); });
        }
    
        this.addDce = async (dce) =>{//Function for adding a dce to the list and the database
            this.list.push(dce);
            const {id, scList, ...dceToSave} = dce;//seperate the id (which is null as database creates id and scList from the part that has to be saved to db)
            let dceColl = pemFirestore.collection('users').doc(this.uid).collection('DceList');
            dceColl.add(Object.assign({},dceToSave))
            .then((docRef)=>{
                  console.log("Document written with ID: ", docRef.id);
                  dce.id = docRef.id;//set the id of the dce in the list after it's received from the database
                  return docRef.id//return the id as received from the database
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
            return dce.name //returns the dce name
        }

    this.clearCollection = (dceId, collection) =>{//helper function to delete subcollections in firebase. These are not deleted automatically
      const ref = pemFirestore.collection('users').doc(this.uid).collection('DceList').doc(dceId.toString()).collection(collection)
        ref.get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            if(collection==='AspectList'){//if AspectList collection is deleted, also delete Combis collection
              ref.doc(doc.id).collection('Combis').onSnapshot((combiSnapshot)=>{
                combiSnapshot.docs.forEach((combiDoc)=>{
                  ref.doc(doc.id).collection('Combis').doc(combiDoc.id).delete()
                  .then(()=>{console.log("Combi deleted with id "+combiDoc.id)})
                })
              })
            }
            ref.doc(doc.id).delete()
            .then(()=>{
              console.log("Document deleted with id "+doc.id+ " from collection "+collection)
            })
          })
        })
      }
    } 
}
export default DceList