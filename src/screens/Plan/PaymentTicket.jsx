import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "@/utils/styles/PaymentTicket.module.css";
import { CustomButton } from "@/components";
import PaymentCard from "@/components/Payment/PaymentCard";
// amplify
import { API, Storage, Auth } from "aws-amplify";
import * as queries from "@/graphql/queries";
import * as mutation from "@/graphql/customMutations";
import { useRecoilState, useRecoilValue } from "recoil";
import LeftHeader from "@/routes/Header/LeftHeader";

const PaymentTicket = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const { booking, tickets, customer, customerTicket } = route.params;
  const [paymentOrder, setPaymentOrder] = useState("");
  const [refresh, setRefresh] = useState(false);
  const total = tickets * booking.price;
  console.log(customerTicket)
  const onHandlePayment = async (data) => {
    // Crear OrderDetail
    try {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const payment = await API.graphql({
        query: mutation.createPayment,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            reference: customer,
            amount: total,
            userID: attributes["custom:userTableID"],
          },
        },
      });
      setPaymentOrder(payment.data.createPayment.id);
      console.log(payment);
    } catch (error) {
      console.log(error);
    }
  };
  const onHandleOrder = async (data) => {
    // Crear OrderDetail
    try {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const orderDetail = await API.graphql({
        query: mutation.createOrderDetail,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            amount: tickets,
            paymentMethod: "Pago Movil",
            customerName: attributes.name,
            paymentID: paymentOrder,
            customerDocument: customer,
            isGuest: false,
            total: total,
            customerEmail: attributes.email,
            userID: attributes["custom:userTableID"],
            bookingID: booking.id, 
          },
        },
      });
      console.log(orderDetail);

      const customer = await API.graphql({
        query: mutation.createCustomer,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            fullName: customerTicket.fullName,
            ci: customerTicket.ci,
            email: customerTicket.email,
          },
        },
      });
      console.log(customer.data.createCustomer)
      // Crear Orders Tickets
      let orderTicketsTemporal = [];
      let ticketsPaid = [];
      console.log('aqui toy', booking)
      while (orderTicketsTemporal.length < tickets) {
        const orderTicket =
          booking.tickets.items[
            Math.floor(Math.random() * booking.tickets.items.length)
          ];
        console.log(orderTicket);
        if (
          !orderTicketsTemporal.some(
            (obj) => obj.id === orderTicket.id && obj.status === "Active"
          )
        ) {
          orderTicketsTemporal.push(orderTicket);
        }
      }
      orderTicketsTemporal.map(async (item, index) => {
        /* Creamos los orders tickets */
        const orderTicketDetail = await API.graphql({
          query: mutation.createOrderTicket,
          authMode: "AWS_IAM",
          variables: {
            input: {
              orderID: orderDetail.data.createOrderDetail.id,
              ticketID: item.id,
            },
          },
        });
        console.log(orderTicketDetail);
        /* Actualizamos el status de los tickets */
        const updateTicketStatus = await API.graphql({
          query: mutation.updateTicket,
          authMode: "AWS_IAM",
          variables: {
            input: {
              id: item.id,
              status: "PAID",
              customerID: customer.data.createCustomer.id
            },
          },
        });
        console.log(updateTicketStatus.data.updateTicket.id);
        ticketsPaid.push(updateTicketStatus.data.updateTicket.id);

        /* Actualizamos customer */

      const customerUpdate = await API.graphql({
        query: mutation.updateCustomer,
        authMode: "AWS_IAM",
        variables: {
          input: {
            id: customer.data.createCustomer.id,
            ticketID: item.id,
          },
        },
      });
      console.log(customerUpdate.data.updateCustomer)
      });

      /* Actualizamos el stock */
      const updateBookingStock = await API.graphql({
        query: mutation.updateBooking,
        authMode: "AWS_IAM",
        variables: {
          input: {
            id: booking.id,
            stock: booking.stock - tickets,
          },
        },
      });
      console.log(updateBookingStock, 'toy aqui manito');

      
      // console.log('aqui llego manito')
      setRefresh(true)
      setTimeout(() => {
        navigation.navigate("ViewTicket", {
          data: booking,
          order: orderDetail.data.createOrderDetail.id,
          payment: paymentOrder,
          customer: {
            name: customerTicket.fullName,
            email: customerTicket.email,
            id: customerTicket.ci,
          },
          quantity: tickets,
          tickets: ticketsPaid
        });
        setRefresh(false)
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const test = async () => {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user)
  }
  useEffect(() => {
    // test()
  }, [])
  
  return (
    <ScrollView style={[styles.container, global.bgWhite]}>
      <View style={[styles.topContent, global.bgWhite]}>
        {/* <Image
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            borderBottomLeftRadius: 40,
            resizeMode: "cover",
          }}
          source={require("@/utils/images/background-profile.png")}
        /> */}
        <View style={styles.text}>
          <Text style={[styles.titleTop, global.mainColor]}>
            Hora de pagar tu viaje
          </Text>
          <View style={[styles.ticketsContainer]}>
            <Text style={[styles.titleTickets, global.black]}>
              {tickets} boleto(s) de viaje
            </Text>
            <Text style={[styles.titlePrice, global.black]}>${total}.00</Text>
          </View>
        </View>
      </View>
      <View style={[styles.content, global.bgWhite]}>
        <PaymentCard
          button={true}
          text="Pagar"
          order={{
            mount: total,
            arrival: booking.arrivalCity,
            id: customer,
            quantity: tickets,
          }}
          handlePress={onHandlePayment}
        />
        <View style={[styles.guarented, global.bgWhiteSoft]}>
          <Image
            style={{
              width: 35,
              height: 35,
              resizeMode: "cover",
            }}
            source={require("@/utils/images/guarented.png")}
          />
          <Text style={[styles.titleGuarented, global.topGray]}>
            Esta compra esta protegida y tiene garantia
          </Text>
        </View>
        <CustomButton
          text={`Obtener boleto(s)`}
          handlePress={onHandleOrder}
          textStyles={[styles.textContinue, global.white]}
          buttonStyles={[styles.continue, global.mainBgColor]}
          loading={refresh}
        />
      </View>
    </ScrollView>
  );
};

export default PaymentTicket;
