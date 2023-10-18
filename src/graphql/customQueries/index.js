export const listBookings = /* GraphQL */ `
  query ListBookings(
    $filter: ModelBookingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        status
        code
        agencyID
        officeID
        transport
        departureCity
        arrivalCity
        departure {
          time
          date
          city
          state
          address
        }
        arrival {
          time
          date
          city
          state
          address
        }
        stock
        price
        tickets {
          items {
            id
          }
        }
        driver
        transport
        createdBy
        createdAt
        updatedAt
        
      }
      nextToken
    }
  }
`;

export const listOrderDetails = /* GraphQL */ `
  query ListOrderDetails(
    $filter: ModelOrderDetailFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrderDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        amount
        paymentMethod
        customerName
        customerEmail
        isGuest
        paymentID
        payment {
          id
          reference
          amount
          metadata
          userID
          createdAt
          updatedAt
          owner
        }
        orderTickets {
          items {
            id
            ticketID
          }
          nextToken
        }
        bookingID
        userID
        createdAt
        updatedAt
        userOrdersId
        owner
      }
      nextToken
    }
  }
`;

export const getTicket = /* GraphQL */ `
  query GetTicket($id: ID!) {
    getTicket(id: $id) {
      id
      code
      bookingID
      stop
      customerID
      seating
      status
      description
      url
      owner
      createdAt
      updatedAt
      stopBookingTicketsId
    }
  }
`;
export const getBooking = /* GraphQL */ `
  query GetBooking($id: ID!) {
    getBooking(id: $id) {
      id
      code
      agencyID
      officeID
      transport
      stops {
        items {
          id
          bookingID
          price
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
      departureCity
      arrivalCity
      departure {
        time
        date
        city
        state
        address
      }
      arrival {
        time
        date
        city
        state
        address
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

export const getAgency = /* GraphQL */ `
  query GetAgency($id: ID!) {
    getAgency(id: $id) {
      id
      cognitoID
      pin
      name
      rif
      email
      phone
      officies {
        items {
          id
          agencyID
          name
          state
          city
          address
          email
          phone
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
      employees {
        items {
          id
          name
          email
          phone
          pin
          type
          agencyID
          officeID
          owner
          lastConnection
          createdAt
          updatedAt
        }
        nextToken
      }
      bookings {
        items {
          id
          status
          code
          agencyID
          officeID
          departureCity
          arrivalCity
          stock
          price
          createdBy
          driver
          transport
          owner
          createdAt
          updatedAt
        }
        nextToken
      }
      owner
      createdAt
      updatedAt
    }
  }
`;