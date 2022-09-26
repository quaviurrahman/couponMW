//get list of coupons which are in scheduled status
function getScheduledCoupons () {
  axios
  .get('http://localhost:8800/coupons/getbystatus/scheduled')
  .then(response => {
    console.log(response.data)})
  }

//prepare a list of coupons which have their validity start date equal or more than current date and time 
//change the status from "scheduled" to "valid" of the coupons in the filter list from above

export default getScheduledCoupons