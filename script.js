
let addbtn=document.querySelector(".add-btn");
let removeBtn=document.querySelector(".remove-btn")
let modalcont=document.querySelector(".modal-cont");
let mainCont=document.querySelector(".main-cont");
let modaltextarea=document.querySelector(".textarea-cont");
let allPriorityColors=document.querySelectorAll(".priority-color");

//for filtering through toolbax tab
toolboxColors=document.querySelectorAll(".color");

//list out all colors
colors=["lightpink","lightblue","lightgreen","black"]
//to set black as default color
let modalPriorityColor=colors[colors.length-1]
let addFlag=false;
let removeFlag=false;
let lockClass="fa-lock"
let unlockClass="fa-lock-open"

//object of tickets
let ticketsArr=[]

//TO SHOW FROM SAVED STORAGE
if(localStorage.getItem("jira-tickets")){
    ticketsArr=JSON.parse(localStorage.getItem("jira-tickets"));

    ticketsArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketid);
    })
}
for(let i=0;i<toolboxColors.length;i++){ 
    toolboxColors[i].addEventListener("click",(e)=>{
        let currToolboxColor=toolboxColors[i].classList[0];
        
        //selecting filtered tickets
        let filteredTickets=ticketsArr.filter((ticketObj,idx)=>{
            return currToolboxColor === ticketObj.ticketColor;
        })

        //removing previously displayed tickets
        let allTicketsCont=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        //displat filtered tickets
        filteredTickets.forEach((ticketObj,idx)=>{
            //to check for duplicacy go to createTicket function
          
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketid);
        })
        
    })

    //to diplay tickets previosly  displayed unfiltered tickets
    toolboxColors[i].addEventListener("dblclick",(e)=>{
      
        let allTicketsCont=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        ticketsArr.forEach((ticketObj,idx)=>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketid);
        })
    })
}
//Event listener for modal priority coloring
allPriorityColors.forEach((colorelem,idx)=>{
    colorelem.addEventListener("click",(e)=>{
        //to remove border for selected color element i.e black
        allPriorityColors.forEach((priorityColrElem,idx)=>{
            priorityColrElem.classList.remove("border");
        })
        //add bprder to selected color
        colorelem.classList.add("border");

        //to get color from sdlected colors in modal
        modalPriorityColor=colorelem.classList[0]
    })
})

addbtn.addEventListener("click",(e)=>{
    //Display Modal
     
    //Generate ticket

    //addFlag-true show modal

    //addFlag false hide Modal
     addFlag=!addFlag
    
     if(addFlag){
         modalcont.style.display="flex";
     }else{
        modalcont.style.display="none";
     }

})

removeBtn.addEventListener("click",(e)=>{
    removeFlag=!removeFlag;
})

modaltextarea.addEventListener("keydown",(e)=>{
    let key=e.key
    // console.log(key);
    if(key==="Shift"){
        // console.log("shift");
        createTicket(modalPriorityColor,modaltextarea.value);
       
        setModalToDefault();
        addFlag=false;
        
    }
})


//paramets ticketcolor,tickettask,ticketid
function createTicket(ticketColor,ticketTask,ticketid){
    // to check for duplicacy
    let id=ticketid || shortid();
    let ticketcont=document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");
    ticketcont.innerHTML=`
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id} </div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;
    mainCont.appendChild(ticketcont)
    

    //saving to local Storgae
    if(!ticketid){
        ticketsArr.push({ticketColor,ticketTask,ticketid: id});
        localStorage.setItem("jira-tickets",JSON.stringify(ticketsArr))
    } 
    

    //remove button handle lstener
    handelRemoval(ticketcont,id);
    handleLock(ticketcont,id);
    handleColor(ticketcont,id);
}

function handelRemoval(ticket,id){
    ticket.addEventListener("click",(e)=>{
         if(!removeFlag)return;
    
         //DB REMOVAL
        let ticketIdx=getTicketIdx(id);
        ticketsArr.splice(ticketIdx,1);
        let strTicketsArr=JSON.stringify(ticketsArr);
        localStorage.setItem("jira-tickets",strTicketsArr);

        //UI REMOVAL
        ticket.remove();
    })
   
    
}
function handleLock(ticket,id){
    
    let ticketLockElem=ticket.querySelector(".ticket-lock")
    let ticketLock=ticketLockElem.children[0];
    //edit contnet after unlock
    let ticketTaskArea=ticket.querySelector(".task-area");
    
    ticketLock.addEventListener("click",(e)=>{
        let ticketIdx=getTicketIdx(id);
       
        //to toggle lock unlock
        if(ticketLock.classList.contains(lockClass)){
                ticketLock.classList.remove(lockClass)
                ticketLock.classList.add(unlockClass);
                //edit contnet after unlock
                ticketTaskArea.setAttribute("contenteditable","true");
                
        }else{
            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
            
        }
        // console.log(ticketsArr[ticketIdx]);
        //Modify ticket text and saving to local storage
     
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        console.log(ticketsArr);
        localStorage.setItem("jira-tickets", JSON.stringify(ticketsArr));

    })
}

//changes the color of genrated ticket color to next one
function handleColor(ticket,id){

    //get ticket index from ticketsArray
    let ticketIdx=getTicketIdx(id);
    // console.log(ticketIdx);
    let ticketColor=ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
           //to know the current color
    let currTicketColor=ticketColor.classList[1];

    //get ticketcolor index
    let currTickeColoridx=colors.findIndex((color)=>{
        return currTicketColor==color
    })
 
    
    currTickeColoridx++;
    
    let newTicketColorIdx=currTickeColoridx%colors.length;
    
    let newTicketColor=colors[newTicketColorIdx];
 
    //remove and add new ticket color
    ticketColor.classList.remove(currTicketColor)
    ticketColor.classList.add(newTicketColor);

    //modifying and saving color 
    ticketsArr[ticketIdx].ticketColor=newTicketColor;

    localStorage.setItem("jira-tickets",JSON.stringify(ticketsArr));
    })
    
 
}

function setModalToDefault(){
    modalcont.style.display="none";
    modaltextarea.value="";
    modalPriorityColor=colors[colors.length-1]
    for(let i=0;i<allPriorityColors.length;i++){
        allPriorityColors[i].classList.remove("border");
    };
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}

function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketid === id;
    })
    
    return ticketIdx;
}