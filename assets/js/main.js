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
      trashIcon = document.createElement('i'),
      editIcon = document.createElement('i');

    editIcon.setAttribute('class', 'text-primary fa fa-pencil-square');
    editIcon.setAttribute('aria-hidden', 'true');
    editIcon.setAttribute('data-id', doc.id);
    
    trashIcon.setAttribute('class', 'text-danger mx-2 fa fa-trash-o');
    trashIcon.setAttribute('aria-hidden', 'true');
    trashIcon.setAttribute('data-id', doc.id);

    divContentActions.setAttribute('class', 'testdel d-flex justify-content-end')
    divContentActions.append(trashIcon, editIcon);

    pDescript.setAttribute('class', 'card-text');
    pDescript.textContent = doc.data().description;

    h5Title.setAttribute('class', 'card-title');
    h5Title.setAttribute('data-id', doc.id);
    h5Title.textContent = doc.data().title;


    divCardBody.setAttribute('class', 'card-body');
    divCardBody.append(h5Title, pDescript, divContentActions);

    divCard.setAttribute('class', 'card shadow');
    divCard.appendChild(divCardBody);

    divColumn.setAttribute('data-id', doc.id);
    divColumn.setAttribute('class', 'col-12 col-md-4 my-3');
    divColumn.appendChild(divCard);

    el.listCards.appendChild(divColumn);

    // console.log(doc)

    trashIcon.addEventListener('click', this.remove);
    editIcon.addEventListener('click', () => { this.update(Event, h5Title, pDescript) });

    // return divColumn;
  },

  remove(event) {
    let id = event.target.dataset.id;

    todoBest.doc(id).delete();
  },
  update(event, title, descrip) {
    el.formAddTodo.title.value = title.textContent;
    el.formAddTodo.description.value = descrip.textContent;
    el.formAddTodo.title.setAttribute('data-id', title.getAttribute('data-id'));
    el.formAddTodo.title.focus();
  }
}


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

  if (this.title.getAttribute('data-id') !== '') {
    todoBest.doc(this.title.getAttribute('data-id')).update({
      title,
      description,
      createdAt: timestamp()
    });
    this.title.setAttribute('data-id', '');
  } else {
    todoBest.add({
      title,
      description,
      createdAt: timestamp()
    });
  }

  this.title.classList.remove('border', 'border-danger');
  el.boxError.parentElement.classList.remove('alert', 'alert-warning');

  el.boxError.parentElement.classList.add('alert', 'alert-success');
  el.boxError.textContent = 'To do salva com sucesso!'

  this.reset();
  return;
});


// realtime firestore
todoBest.onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function(change) {
    switch(change.type) {
      // added
      case 'added':
        card.display(change.doc);
        break;
      // 'removed'
      case 'removed':
        let todo = el.listCards.querySelector(`div[data-id='${change.doc.id}']`);
        el.listCards.removeChild(todo);
        break;
      // modified
      case 'modified':
        const cardId = document.querySelector(`div[data-id=${change.doc.id}]`)

        const title = cardId.querySelector('div.card h5');
        const description = cardId.querySelector('div.card p');

        title.textContent = change.doc.data().title;
        description.textContent = change.doc.data().description;
        break;
    }
  });
});