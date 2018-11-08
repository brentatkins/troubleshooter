# Partner platform

Personas

- reseller
- support partner
- site reliability team
- hardware support provider
- buyer/hardware owner

Standout terms

- selling
- track failures (support workflow)
- inventory mgmt
- device monitoring

## Questions

- What are the current pain points? What problems with this application solve?
- What are some of the activities that users would perform?
- What is the single action resellers would like to accomplish? Same for support providers.
- Should the focus be on either support providers OR resellers, not both at this point
- Describe some high level user journeys? What are the user goals?
- Is this two independent systems? Is there any crossover between reseller and support partner? Any workflows involving these two?
- Are there any existing applications that require integration (e.g. inventory mgmt)
- What, Who, Where, Why

## Components

- too early
- inverntory service
- issue tracking service
- notification service

## Metrics to track

- what are the behavious we're looking to drive? sales? low support? swift issue resolution?
- number of issues per day/week/month
- time to resolution
- units sold per partner

## Scale up

- service based approach, rather than a single web process
- individual services may scale
- event/message based
- may need to partition the database for different geo-locations

## Database entities

- prefer to model domain rathr than data
- what are the events? identify bounded contexts?

- possibly a sales context and a support context
- posible entities in sales:
  - Reseller
  - Customer
  - Product
  - Device
- posible entities in support:
  - Customer
  - SupportTicket
  - Device

## Integrate with other hardware devices

## Priorisation

- user needs
- get users (or representative) to assist in assessing impact
- high impact/low cost
-
