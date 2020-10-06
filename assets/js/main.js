const el = {
  btnAddTodo: document.querySelector('.addBtn'),
  formAddTodo: document.querySelector('.formAddTodo'),
  listCards: document.querySelector('.listCards'),
  btnDelCard: document.querySelector('.btnDelCard'),
  boxError: document.querySelector('.boxError__text'),
};

// Configurando o firebase
const firebaseConfig = {
  apiKey: "AIzaSyAjJGz7Bicg1MrDc81LIRqDCTz5sMIuj50",
  authDomain: "ldantas-learn-firebase.firebaseapp.com",
  databaseURL: "https://ldantas-learn-firebase.firebaseio.com",
  projectId: "ldantas-learn-firebase",
  storageBucket: "ldantas-learn-firebase.appspot.com",
  messagingSenderId: "912550901440",
  appId: "1:912550901440:web:3ab63c5c5704ba6334df25"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const todoBest = db.collection('todoBest');


// Card functions
const card = {
  display(doc = null)  {
    let 
      divColumn = document.createElement('div'),
      divCard = document.createElement('div'),
      divCardBody = document.createElement('div'),
      divContentActions = document.createElement('div'),
      h5Title = document.createElement('h5'),
      pDescript = document.createElement('p'),
      aDelete = document.createElement('a'),
      trashIcon = document.createElement('i');
    
    trashIcon.setAttribute('class', 'fa fa-trash-o');
    trashIcon.setAttribute('aria-hidden', 'true');

    aDelete.setAttribute('data-id', doc.id);
    aDelete.setAttribute('class', 'btnDelCard card-link');

    divContentActions.setAttribute('class', 'testdel d-flex justify-content-end')
    divContentActions.append(aDelete, trashIcon);

    pDescript.setAttribute('class', 'card-text');
    pDescript.textContent = doc.data().description;

    h5Title.setAttribute('class', 'card-title');
    h5Title.textContent = doc.data().title;

    divCardBody.setAttribute('class', 'card-body');
    divCardBody.append(h5Title, pDescript, divContentActions);

    divCard.setAttribute('class', 'card shadow');
    divCard.appendChild(divCardBody);

    // divColumn.setAttribute('data-id', `${Math.floor(Math.random() * 10 + (Math.floor(Math.random() * 10)))}`);
    divColumn.setAttribute('data-id', doc.id);
    divColumn.setAttribute('class', 'col-12 col-md-4 my-3');
    divColumn.appendChild(divCard);

    el.listCards.appendChild(divColumn);

    // console.log(doc)

    aDelete.addEventListener('click', this.remove);

    return divColumn;
  },

  remove(event) {
    let id = event.target.dataset.id;

    todoBest.doc(id).delete();
  }
}

// card.display('title todo 2', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, atq');
// card.display('title todo 2', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, atq');

// post todobest
el.formAddTodo.addEventListener('submit', function(e) {
  e.preventDefault()
  let title = this.title.value;
  let description = this.description.value;
  
  
  if (!title) {
    this.title.classList.add('border', 'border-danger');
    el.boxError.parentElement.classList.add('alert', 'alert-warning');
    el.boxError.textContent = 'Por favor, preencha os campos obrigatórios';
    return;
  }

  this.title.classList.remove('border', 'border-danger');
  el.boxError.parentElement.classList.remove('alert', 'alert-warning');

  el.boxError.parentElement.classList.add('alert', 'alert-success');
  el.boxError.textContent = 'To do salva com sucesso!'

  todoBest.add({
    title,
    description,
    createdAt: timestamp()
  })
  .then((docRef) => console.log('Document written with ID: ', docRef.id))
  .catch((error) => console.error('Error adding document: ', error));


  this.reset();
});


// realtime firestore
todoBest.onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function(change) {
    switch(change.type) {
      case 'added':
        card.display(change.doc);
        break;
      // 'modified'
      case 'removed':
        let todo = el.listCards.querySelector(`div[data-id='${change.doc.id}']`);
        el.listCards.removeChild(todo);
      // 'removed'
    }
  });
});