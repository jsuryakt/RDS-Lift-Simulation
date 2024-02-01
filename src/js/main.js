const container = document.getElementById('container');
const liftEle = document.getElementById('no-of-lifts');
const floorEle = document.getElementById('no-of-floors');
const initBtn = document.getElementById('init-btn');
let liftStore = [];
const FLOOR_GAP = 122;

function buildStructure(noOfLifts, noOfFloors) {
  buildFloors(noOfFloors);
  buildLifts(noOfLifts);
}

function buildFloors(noOfFloors) {
  const floorNodes = document.getElementsByClassName('floor-container');
  removeNodes(floorNodes);
  let floorStr = '';
  for (let i = noOfFloors; i > 0; i--) {
    const isLastFloor = i === noOfFloors;
    const isFirstFloor = i === 1;
    floorStr += `<div class="floor-container">
      <div class="floor-buttons">
        <button class="up floor-button${isLastFloor ? ' disabled' : ''}"
        data-id="${i}"
        ${isLastFloor ? 'disabled' : ''}>UP</button>
        <button class="down floor-button${isFirstFloor ? ' disabled' : ''}"
        data-id="${i}"
        ${isFirstFloor ? 'disabled' : ''}>DOWN</button>
      </div>
      <hr class="floor"/>
      <p class="floor-num">Floor ${i}</p>
    </div>`;
  }
  container.insertAdjacentHTML('beforeend', floorStr);

  const floorBtns = document.getElementsByClassName('floor-button');
  Array.from(floorBtns).forEach(btn => {
    btn.addEventListener('click', () => {
      const clickedFloor = parseInt(btn.dataset.id);
      const bestLift = liftStore.filter(lift => !lift.isBusy).
          sort((l1, l2) => Math.abs(l1.currentFloor - clickedFloor) -
              Math.abs(l2.currentFloor - clickedFloor))[0];
      if (!bestLift) {
        console.log('All lifts are busy');
        return;
      }
      console.log('clicked on', clickedFloor, 'best floor available', bestLift);
      bestLift.isBusy = true;

      const shouldGoUp = clickedFloor > bestLift.currentFloor;
      const liftEle = document.getElementById('lift-' + bestLift.id);
      let calculatedFloorDiff = FLOOR_GAP * Math.abs(clickedFloor - bestLift.currentFloor);
      if (!shouldGoUp) {
        // go down
        calculatedFloorDiff *= -1;
      }
      const currBottom = parseInt(window.getComputedStyle(liftEle).bottom);
      console.log('current val', currBottom, 'bottom val', calculatedFloorDiff);
      liftEle.style.bottom = `${currBottom + calculatedFloorDiff}px`;
      liftEle.addEventListener('transitionend', () => {
        bestLift.currentFloor = clickedFloor;
        bestLift.isBusy = false;
      });
    });
  });
}

function initLifts() {
  const liftNodes = document.getElementsByClassName('wrapper');
  removeNodes(liftNodes);
  liftStore = [];
}

function buildLifts(noOfLifts) {
  initLifts();
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  let liftStr = '';
  for (let i = 1; i <= noOfLifts; i++) {
    liftStr += `<div class="lift-container"><div class="lift" id="lift-${i}"></div></div>`;
    liftStore.push({id: i, currentFloor: 1, isBusy: false});
  }
  wrapper.innerHTML = liftStr;
  container.insertAdjacentElement('beforeend', wrapper);
}

function removeNodes(nodes) {
  const floorArray = Array.from(nodes);

  floorArray.forEach(element => {
    element.remove();
  });
}

initBtn.addEventListener('click', () => {
  const noOfLifts = liftEle.value;
  const noOfFloors = floorEle.value;
  console.log(noOfLifts, noOfFloors);
  if (noOfLifts > 0 && noOfFloors > 0) {
    buildStructure(noOfLifts, noOfFloors);
  } else {
    alert('Enter proper input');
  }
});