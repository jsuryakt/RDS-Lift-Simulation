const container = document.getElementById('container');
const liftEle = document.getElementById('no-of-lifts');
const floorEle = document.getElementById('no-of-floors');
const initBtn = document.getElementById('init-btn');
let liftStore = [];
const FLOOR_GAP = 122;
const BASE_BOTTOM = 90;
// delay per floor
const MOVE_DELAY = 2;
const LIFT_WIDTH = 50;
const DOOR_WIDTH = LIFT_WIDTH/2;
let queue = [];

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
      queue.push(clickedFloor);
      console.log(queue);
      moveLift(queue.shift());
    });
  });
}

function moveLift(clickedFloor) {
  const bestLift = liftStore.filter(
      lift => !lift.isBusy || (lift.currentFloor === clickedFloor && !lift.doorBusy)).
      sort((l1, l2) => Math.abs(l1.currentFloor - clickedFloor) -
          Math.abs(l2.currentFloor - clickedFloor))[0];

  if (!bestLift) {
    //insert into the beginning
    queue.unshift(clickedFloor);
    console.log("waiting for a free lift");
    return;
  }

  if (bestLift.isBusy && bestLift.currentFloor === clickedFloor) {
    console.log("lift is already in the floor and busy")
    return;
  }

  const floorDiff = clickedFloor - bestLift.currentFloor;
  const liftEle = document.getElementById('lift-' + bestLift.id);
  const doors = Array.from(liftEle.getElementsByClassName('door'));
  const leftDoor = doors[0];
  const rightDoor = doors[1];
  // same floor
  if (floorDiff === 0) {
    // since we don't change bottom if on same floor transitionstart will not be called, so setting isBusy here
    bestLift.isBusy = true;
    bestLift.currentFloor = clickedFloor;
    bestLift.doorBusy = true;
    openDoors(leftDoor, rightDoor);
  } else {
    const currBottom = (bestLift.currentFloor - 1) * FLOOR_GAP + BASE_BOTTOM;
    // to listen on lift move and set it busy
    liftEle.addEventListener('transitionstart', (e) => {
      if (e.propertyName === 'bottom') {
        bestLift.isBusy = true;
      }
    }, {once: true});
    let calculatedFloorDiff = FLOOR_GAP * Math.abs(floorDiff);
    if (floorDiff < 0) {
      // go down
      calculatedFloorDiff *= -1;
    }
    bestLift.currentFloor = clickedFloor;
    // more no of floors more delay, since we need to maintain MOVE_DELAY(2s) on each floor
    liftEle.style.transitionDuration = `${Math.abs(floorDiff) * MOVE_DELAY}s`;
    liftEle.style.bottom = `${currBottom + calculatedFloorDiff}px`;
  }
  // to listen on door close
  let count = {transitionCount: 0};
  leftDoor.addEventListener('transitionend', e => {
    // to not trigger liftEle transitionend event since it bubbles
    e.stopImmediatePropagation();
    onDoorWidthEndEvent(leftDoor, rightDoor, bestLift, count)
  });
  // otherwise it would bubble up to trigger liftEle transitionend event
  rightDoor.addEventListener('transitionend', e => e.stopImmediatePropagation());
  // to listen on lift target floor reach
  liftEle.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'bottom') {
      bestLift.doorBusy = true;
      openDoors(leftDoor, rightDoor);
      // bestLift.currentFloor = clickedFloor;
    }
  }, {once: true});
}

function onDoorWidthEndEvent(leftDoor, rightDoor, bestLift, count) {
  count.transitionCount++;

  // we first set width to 0 on lift reaching target floor, then set it back to original width
  // so 2 transition events are fired, and we want to listen to the 2nd one, and then set the lift free and check the queue
    if (count.transitionCount === 2) {
      leftDoor.removeEventListener('transitionend', onDoorWidthEndEvent);
      count.transitionCount = 0;
      // we free the lift after closing the door
      bestLift.isBusy = false;
      if (queue.length > 0) {
        moveLift(queue.shift());
      }
    } else {
      leftDoor.style.width = `${DOOR_WIDTH}px`;
      rightDoor.style.width = `${DOOR_WIDTH}px`;
      bestLift.doorBusy = false;
    }
}

function openDoors(...doors) {
  doors.forEach(door => door.style.width = '0');
}

function initLifts() {
  const liftNodes = document.getElementsByClassName('wrapper');
  removeNodes(liftNodes);
  liftStore = [];
  queue = [];
}

function buildLifts(noOfLifts) {
  initLifts();
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  let liftStr = '';
  for (let i = 1; i <= noOfLifts; i++) {
    liftStr += `<div class="lift-container"><div class="lift" id="lift-${i}"><div class="door"></div><div class="door"></div></div></div>`;
    liftStore.push({id: i, currentFloor: 1, isBusy: false, doorBusy: false});
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
  if (noOfLifts > 0 && noOfFloors > 0) {
    buildStructure(noOfLifts, noOfFloors);
  } else {
    alert('Enter proper input');
  }
});