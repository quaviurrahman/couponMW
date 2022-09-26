function getScheduledCoupons () {
  axios
  .get('http://localhost:8800/coupons/getall')
  .then(response => {
    console.log(response.data)})
  }

export default getScheduledCoupons