import image from '../images/benjamincode-short.png'

// Déroulement des barres

document.getElementById('portrait-img').src = image
const initInterval = (elementsList, v, direction) => {
  for (let i = 0; i < elementsList.length; i++) {
    elementsList[i].style.order = i + 1
  }
  let x = (direction === -1) ? 200 : 0
  const dt = 10
  setInterval(() => {
    x = x + (direction * v * dt)
    elementsList.forEach(element => {
      element.style.transform = `translateX(${-x}%)`
    })
    if (direction === -1 && x < 0) {
      x = 200
    }
    if (direction === 1 && x > 200) {
      x = 0
    }
  }, dt)
}

const primaryList = document.querySelectorAll('.primary > div')
const secondaryList = document.querySelectorAll('.secondary > div')
const v = 0.012
initInterval(primaryList, v, 1)
initInterval(secondaryList, v, -1)

// Parralax effets
document.body.onmousemove = event => {
  const posRelX = event.clientX / window.innerWidth
  document.getElementsByClassName('big')[0].style.left = `${45 + posRelX * 10}%`
  document.getElementsByClassName('small')[0].style.left = `${62.5 - posRelX * 15}%`
  document.getElementById('portrait-img').style.left = `${52.5 - posRelX * 5}%`
}
