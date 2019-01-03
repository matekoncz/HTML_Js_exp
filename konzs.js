const APP_ID = 'A5E288D6-44CC-0891-FF4B-9AF0E06EBC00';
const API_KEY = '9C44D6B9-C1CD-3037-FF80-C2227FC1A700';
 Backendless.serverURL = 'https://api.backendless.com';
 Backendless.initApp(APP_ID, API_KEY);
//---------------------------------------------------------
//---------------------------------------------------------
 var bejelentkezve = undefined
 var azonosit={}
 async function betoltes(){
   document.getElementById("felhd").innerHTML=""
   var users  = await Backendless.Data.of("Users").find()
   console.log(users.length)
   for (var i=0; i<users.length;i++){
     azonosit[users[i].objectId]=users[i].email
     var div = document.createElement("div")
     div.id=users[i].email
     var text= document.createElement("b")
     text.innerHTML=users[i].name
     var img=document.createElement("img")
     img.src=users[i].avatar
     img.classList.add("meret")
     div.classList.add("felh")
     div.appendChild(img)
     div.appendChild(text)
     document.getElementById("felhd").appendChild(div)
   }
   if (bejelentkezve != undefined){
    document.getElementById(bejelentkezve.email).classList.remove("felh")
    document.getElementById(bejelentkezve.email).classList.add("flogin")
    var gomb=document.createElement('input')
    gomb.type="button"
    gomb.value="kép cseréje"
    gomb.onclick=kepcsere
    document.getElementById(bejelentkezve.email).appendChild(gomb)
    }
    szbetoltes()
 }
async function main(){
   bejelentkezve=await Backendless.UserService.getCurrentUser()
   await betoltes()
   
}
main()
  async function login(){
   var nev = document.getElementById("miagmail").value
   var jelszo=document.getElementById("miajelszo").value
   try{
     console.log(nev,jelszo)
     bejelentkezve = await Backendless.UserService.login(nev,jelszo,true)  
   }catch(error){
     window.alert("A MANÓBA! Nem sikerült bejelentkezni.")
     console.log(error)
     return
   }
   await betoltes()
 }
async function kepcsere(){  
 url = window.prompt("KÉP CSERÉJE")
 //document.getElementById(bejelentkezve.email).children[0].src =url
 if (url){
     bejelentkezve.avatar=url; 
     await Backendless.Data.of("Users").save(bejelentkezve)
     betoltes()
}

}
async function szovegeles(){
 console.log("hali")
 var text=document.getElementById("hosszu").value
   await Backendless.Data.of("POSTS").save({
   content:text
   })
   szbetoltes()
}
async function szbetoltes(){
 document.getElementById("chat").innerHTML=""
 var queryBuilder = Backendless.DataQueryBuilder.create();
queryBuilder.setSortBy( ["created" ] );
 var poszt=await Backendless.Data.of("POSTS").find(queryBuilder)
 poszt.forEach(p=>{
   var div = document.createElement("div")
   var i = document.createElement("i")
   div.innerHTML=document.getElementById(azonosit[p.ownerId]).outerHTML
   if(div.children[0].childElementCount==3){
   div.children[0].children[2].remove()
   }
 i.innerHTML=p.content
 div.appendChild(i)
 div.classList.add("bejegyzes")
 div.children[0].style.width="fit-content"
 div.children[0].id=""
 document.getElementById("chat").appendChild(div)
 })
 
}