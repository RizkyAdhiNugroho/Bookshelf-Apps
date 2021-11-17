const Belum_baca = "incompleteBookshelfList";
const Sudah_baca = "completeBookshelfList"; 
const BOOK_ITEMID = "itemId";

const searchBookTitle = document.querySelector("#searchBookTitle");
searchBookTitle.addEventListener("keyup", searchListBookTitle);

function addBook(){
    const unreadBookList = document.getElementById(Belum_baca);
    const readBookList = document.getElementById(Sudah_baca);
    
    const textJudul = document.getElementById("inputBookTitle").value;
    const textPenulis = document.getElementById("inputBookAuthor").value;
    const textTahun = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    
    const book = makeBook(textJudul,textPenulis,textTahun,isComplete);
    const bookObjek = composeBookObject(textJudul,textPenulis,textTahun,isComplete);
    book[BOOK_ITEMID] = bookObjek.id;
    books.push(bookObjek);

    if(isComplete){
        readBookList.append(book);       
    }else{
        unreadBookList.append(book);
    }
    updateDataToStorage();
}

function makeBook(judul,author,tahun,isCompleted){
    const textJudul = document.createElement("h2");
    textJudul.innerText = judul;

    const textAuthor = document.createElement("p");
    textAuthor.innerText =author;

    const textTahun = document.createElement("p");
    textTahun.innerText = tahun;
    
    let button1 = null;
    let button2 = null;
    
    if (isCompleted) {
       button1 = createUndoCheckButton()
       button2= createTrashButton()
    } else {
        button1 = createCheckButton()
        button2 = createTrashButton()
    }

    const containerButtons = document.createElement("div");
    containerButtons.classList.add("action");
    containerButtons.append(button1,button2);

    const Container = document.createElement("article");
    Container.classList.add("book_item")
    Container.append(textJudul,textAuthor,textTahun,containerButtons);

    return Container;
}

function createButton(buttonTypeClass,isCompleted,eventListener){
    const button = document.createElement("button");
    button.innerText = isCompleted;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    
    return button;
}

function createUndoCheckButton() {
    return createButton("green","Baca Ulang",function(event){
       undoTaskFromCompleted(event.target.parentElement.parentElement);
   });
}

function createTrashButton() {
    return createButton("red","Hapus Buku", function(event){
        removeTaskFromCompleted(event.target.parentElement.parentElement);
    });
}

function createCheckButton() { 
    return createButton("green","Sudah Selesai Dibaca",function(event){
        addTaskToCompleted(event.target.parentElement.parentElement);
    });
}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(Sudah_baca);

    const textJudul = taskElement.querySelector(".book_item > h2").innerText;
    const textPenulis = taskElement.getElementsByTagName("p")[0].innerText;
    const textTahun = taskElement.getElementsByTagName("p")[1].innerText;

    const newList = makeBook(textJudul,textPenulis,textTahun,true);
    const book = findBook(taskElement[BOOK_ITEMID]);

    book.isComplete = true;
    newList[BOOK_ITEMID] = book.id;

    listCompleted.append(newList);
    taskElement.remove();
    updateDataToStorage();
} 

function removeTaskFromCompleted(taskElement) {
 if (confirm("Apakah anda yakin untuk menghapus buku?")) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition,1);

    taskElement.remove();
    updateDataToStorage();
    alert("Buku Berhasil dihapus");
  } else {
    alert("Buku Batal dihapus");
  }
}

function undoTaskFromCompleted(taskElement){
    const listUnCompleted = document.getElementById(Belum_baca);

    const textJudul = taskElement.querySelector(".book_item > h2").innerText;
    const textPenulis = taskElement.getElementsByTagName("p")[0].innerText;
    const textTahun = taskElement.getElementsByTagName("p")[1].innerText;

    const newList = makeBook(textJudul,textPenulis,textTahun,false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isComplete = false;
    newList[BOOK_ITEMID] = book.id;

    listUnCompleted.append(newList);
    taskElement.remove();

    updateDataToStorage();
}

function searchListBookTitle(event) {
    const searchBookList = event.target.value.toLowerCase();
    const itemBookList = document.querySelectorAll(".book_item");
  
    itemBookList.forEach((item) => {
      const isiItem = item.firstChild.innerText.toLowerCase();
  
      if (isiItem.indexOf(searchBookList) != -1) {
        item.setAttribute("style", "display: block;");
      } else {
        item.setAttribute("style", "display: none !important;");
      }
    });
  }

function refreshDataFromBook() {
    const listUnRead = document.getElementById(Belum_baca);
    let listRead = document.getElementById(Sudah_baca);
  
  
    for(book of books){
        const newBook = makeBook(book.Judul,book.Author,book.tahun,book.isComplete);
        newBook[BOOK_ITEMID] = book.id;
        
        if(book.isComplete){
            listRead.append(newBook);
        } else {
            listUnRead.append(newBook);
        }
    }
 }