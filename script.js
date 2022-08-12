let monthNav = 0
let selectedDayInt = 0 
let eventDay = 0
//let eventToBeAdded = []
const calendar = document.getElementById('days')

let seletedDayDiv = 0

const weekdays = ['Monday', 'Tuesday', 'Wendnesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

//let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []

function load() {
    const date = new Date()

    if(monthNav !== 0) {
        date.setMonth(new Date().getMonth()+monthNav)
    }

    let dt = date.getDate()
    let day = date.getDay()
    let month = date.getMonth()
    let year = date.getFullYear()

    const firstDayOfTheMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month+1, 0).getDate()

    const dateString = firstDayOfTheMonth.toLocaleDateString('en-uk', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0])

    document.getElementById('month').innerText = 
    `${date.toLocaleDateString('en-uk', {month:'long'})}` 

    document.getElementById('year').innerText = 
    `${date.toLocaleDateString('en-uk', {year:'numeric'})}` 

    calendar.innerText = ''

    for(let i=1; i <= (paddingDays+daysInMonth); i++) {
        const dayString = `${i-paddingDays}/${month+1}/${year}`
        const daySquare = document.createElement('div')
        daySquare.classList.add('day')
        
        if(i>paddingDays) {
            daySquare.innerText = i-paddingDays

            if(i-paddingDays === date.getDate() && monthNav === 0) {
                daySquare.id = 'currentDay'
            }

            daySquare.addEventListener('click', ()=>
             selectedDay(i-paddingDays, dayString))//, eventFunc(dayString))
        } else {
            daySquare.classList.add('padding')
        }

        calendar.appendChild(daySquare)
    }

}

function selectedDay(selectedDayInt, dayString) {
    if(document.querySelector(".selectedDay")) {
        document.querySelector(".selectedDay").classList.remove('selectedDay')
    }

    let numberOfDaysNodes = document.querySelectorAll(".day")
    let numberOfDaysArray = Array.from(numberOfDaysNodes)

    for(i=0; i<numberOfDaysArray.length; i++){
        if(numberOfDaysArray[i].outerText == selectedDayInt) {
            numberOfDaysArray[i].classList.add('selectedDay')
        }   
    }

    eventDay = dayString
    eventFunc(dayString)
}

//adds events to the event menu
function eventFunc(dayString) {
    const calendarEvents = JSON.parse(localStorage.getItem('events'))
    let eventsForDay = []

    for(i=0; i<calendarEvents.length; i++) {
        if(calendarEvents[i].date == dayString) {
            eventsForDay.push(calendarEvents[i])
        }
    }

    //shows existing events
    document.getElementById('events').innerText = ''
    for(i=0; i<eventsForDay.length; i++) {
        const eventDiv = document.createElement('div')
        eventDiv.classList.add('eventContent')
        eventDiv.innerText = eventsForDay[i].title

        const deleteEvent = document.createElement('button')
        deleteEvent.classList.add('deleteEventBtn')
        deleteEvent.innerText = 'remove'
        if(deleteEvent){
            let eventNum = i
            deleteEvent.addEventListener('click', ()=> {
                removeEventBtn(eventsForDay[eventNum])
            })
        }

        eventDiv.appendChild(deleteEvent)
        document.getElementById('events').appendChild(eventDiv)
    }
}

//adds events to the local storage
function addEventBtn() {
    let localStorageEvents = JSON.parse(localStorage.getItem('events'))
    
    if(localStorageEvents) {
        localStorageEvents.push({
            date: eventDay,
            title: document.getElementById('addEventInput').value
        })
    } else {
        localStorageEvents = [{
            date: eventDay,
            title: document.getElementById('addEventInput').value
        }]
    }

    localStorage.setItem('events', JSON.stringify(localStorageEvents))
    document.getElementById('addEventInput').value = ''
}

//removes event from the local storage
function removeEventBtn(eventToBeDelted) {
    let localStorageEvents = JSON.parse(localStorage.getItem('events'))

    eventToBeDeltedDate = eventToBeDelted.date
    eventToBeDeltedTitle = eventToBeDelted.title

    for(i=0; i<localStorageEvents.length; i++) {
        if(localStorageEvents[i].date == eventToBeDeltedDate 
            && localStorageEvents[i].title == eventToBeDeltedTitle) {
                localStorageEvents.splice(i, 1)
                localStorage.setItem('events', JSON.stringify(localStorageEvents))
            }
    }
    eventFunc(eventDay)
}

//initializes the buttons
function initButtons() {
    document.getElementById('nextBtn').addEventListener('click', ()=> {
        monthNav++;
        load()
    })

    document.getElementById('backBtn').addEventListener('click', ()=> {
        monthNav--;
        load()
    })

    document.getElementById('addEventBtn').addEventListener('click', ()=> {
        addEventBtn()
        eventFunc(eventDay)
        //load()
    })
}

function initDate() {
    const date = new Date()
    const dt = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    eventDay = `${dt}/${month+1}/${year}`
    selectedDay(dt, eventDay)
}

load()
initButtons()
initDate()
