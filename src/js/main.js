const container = document.getElementById('container');
const liftEle = document.getElementById('no-of-lifts');
const floorEle = document.getElementById('no-of-floors');
const initBtn = document.getElementById('init-btn');

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
    floorStr += `<div class="floor-container" id="floor-${i}">
      <div class="floor-buttons">
        <button class="up floor-button ${isLastFloor ?
        'disabled' :
        ''}" ${isLastFloor ? 'disabled' : ''}>UP</button>
        <button class="down floor-button ${isFirstFloor ?
        'disabled' :
        ''}" ${isFirstFloor ? 'disabled' : ''}>DOWN</button>
      </div>
      <hr class="floor"/>
      <p class="floor-num">Floor ${i}</p>
    </div>`;
  }
  container.insertAdjacentHTML('beforeend', floorStr);
}

function buildLifts(noOfLifts) {
  const liftNodes = document.getElementsByClassName('lift-container');
  removeNodes(liftNodes);
  const liftContainer = document.createElement('div');
  liftContainer.classList.add('lift-container');
  let liftStr = '';
  for (let i = 1; i <= noOfLifts; i++) {
    liftStr += `<div class="lift" id="lift-${i}"></div>`;
  }
  liftContainer.innerHTML = liftStr;
  container.insertAdjacentElement('beforeend', liftContainer);
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