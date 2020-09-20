const apikey = "DvlaSearchDemoAccount"

document.getElementById('regInput').addEventListener('keyup',function(e){
  document.getElementById('regInput').value = document.getElementById('regInput').value.toUpperCase();
  if (e.keyCode === 13) {
    searchReg();
  }
})
document.getElementById('searchButton').addEventListener('click', searchReg);
document.getElementById('notCar').addEventListener('click', function(){returnHome()});
document.getElementById('isCar').addEventListener('click', function(){success()});

function searchReg(){
  displayLoadingScreen();
  const licencePlate = document.getElementById('regInput').value;
  fetch(`https://dvlasearch.appspot.com/DvlaSearch?apikey=${apikey}&licencePlate=${licencePlate}`,{
    method: "GET"
  })
  .then(
    function(resp){
      if (resp.status !== 200){
        console.log(`Error with DVLA API. Response: ${resp.status}`);
        return
      }
      resp.json()
      .then(
        function(parsedData){
          if (parsedData.hasOwnProperty("error")) {
            returnHome(parsedData.message)
          }
          else {
            showVehicle(parsedData, licencePlate);
          }
        }
      );
    }
  );
}

function displayLoadingScreen(){
  document.getElementById('searchContain').style.display = "none"
  document.getElementById('searchResults').style.display = "none"
  document.getElementById('loading').style.display = "inline-block"
}

function returnHome(err){
  document.getElementById('searchContain').style.display = "inline-block"
  document.getElementById('searchResults').style.display = "none"
  document.getElementById('loading').style.display = "none"
  if (err) {
    document.getElementById('errorMsg').style.display = "block"
    document.getElementById('errorMsg').textContent = `Error: ${err}`
  }
  else {
    document.getElementById('errorMsg').style.display = "none"
  }

}

function showVehicle(vehicleData, licencePlate){
  const vehicleImg = new Image();
  vehicleImg.onload = function(){
    document.getElementById('vehicleImg').src = vehicleImg.src
    document.getElementById('searchContain').style.display = "none"
    document.getElementById('loading').style.display = "none"
    document.getElementById('searchResults').style.display = "inline-block"
  }
  vehicleImg.onerror = function(){
    document.getElementById('vehicleImg').src = "./img/noimg.png"
    document.getElementById('searchContain').style.display = "none"
    document.getElementById('loading').style.display = "none"
    document.getElementById('searchResults').style.display = "inline-block"
  }
  vehicleImg.src = `https://dvlasearch.appspot.com/VehicleImage?apikey=${apikey}&licencePlate=${licencePlate.replace(/\s/g,'')}`
  document.getElementById('vehicleDetails').textContent = `${vehicleData.make} ${vehicleData.model}, ${vehicleData.colour}, ${vehicleData.yearOfManufacture}`
}

function success(){
  document.getElementById('searchResults').innerHTML = "";
  successMsg = document.createElement("h1");
  successMsg.textContent = "Successfully found car details"
  document.getElementById('searchResults').appendChild(successMsg);
}
