COUPON MIDDLEWARE

#   INTRODUCTION

The main objective is to create a basic coupon platform that can be integrated with any other reward systems like loyalty points or any
customer centric platforms. All the consumers of this coupon platform will be able to generate coupons, manage coupons lifecycle and provide
coupon related information to 3PP systems when required.


#   ASSUMPTIONS

> it is assumed that the coupon discount contributers are only of two parties which are ideally the Coupon issuer (in this case bKash)
and the Service provider (in this case the organization). The sum of their coupon discount contribution is 100%.

> it is also assumed that the list of contributing organization is not going to exceed 100 as sending more than 100 contributor data in each 
API call will be an inefficient API design as the payload size is going to increase which is going to degrade the systems performance.

> It is assumed that if no organization list is found in the contributor list then all organization will have their contribution set as per
the overall share rate paramter information.

> system will consider scheduled or instant issue of coupon in bulk or as an individual request

> for a 3PP system the bulk file processing needs to be managed at the 3PP system and call coupon issue API accordingly

> the CPS and paymentOrder middleware/systems are mocked and hence the development environment/uat environment testing is required before GO LIVE!


# FEATURES

*** API based coupon creation,cancellation, redemption, discount amount calculation, discount contribution calculation

*** Auto coupon activation from scheduled state on the configured validaity start date. The checking schedule is configurable.

*** Auto coupon expiration from active to expired state on the configured validity end date. The checking schedule is configurable.

*** 3 modes of discount can be configured 
            1. Flat discount on original transaction amount
            2. Percentage discount on original transaction amount
            3. free of charge discount

*** 