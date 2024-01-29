const container = document.getElementById('container');
const liftEle = document.getElementById('no-of-lifts');
const floorEle = document.getElementById('no-of-floors');
const initBtn = document.getElementById('init-btn');

function buildStructure(noOfLifts, noOfFloors) {
  return undefined;
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