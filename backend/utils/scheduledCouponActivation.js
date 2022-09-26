//get list of coupons which are in scheduled status
function getScheduledCoupons () {
  const scheduledcoupon = axios
  .get('http://localhost:8800/coupons/getbystatus/scheduled')
  .then(response => {response.data})
    return scheduledcoupon
  }

//prepare a list of coupons which have their validity start date equal or more than current date and time
function checkWithCurrentDate () {
return console.log(getScheduledCoupons())
}

//change the status from "scheduled" to "valid" of the coupons in the filter list from above

export default checkWithCurrentDate