import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "@/utils/styles/RouteSearch.module.css";
import CustomTimeDatePicker from "./CustomTimeDatePicker";
import { venezuela } from "@/utils/constants/venezuela";
import CustomModalDeparture from "./CustomModalDeparture";
import CustomModalArrival from "./CustomModalArrival";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { planSearch, routeSearch, loadingSearch } from "@/atoms/Modals";
// import { dateRoute, timeRoute } from "@/atoms/Modals";
import { EvilIcons } from '@expo/vector-icons';

const RouteSearch = () => {
  const global = require("@/utils/styles/global.js");
  const { control } = useForm();
  const route = useRecoilValue(routeSearch);
  console.log(route.date)
  const [result, setResult] = useRecoilState(planSearch);
  const [loading, setLoading] = useRecoilState(loadingSearch);
  let fecha = new Date();
  let minutos = fecha.getMinutes();
  let minutosRedondeados = Math.round(minutos / 15) * 15;
  if (minutosRedondeados === 60) {
    minutosRedondeados = 0;
  }
  let hora = fecha.getHours();
  if (minutosRedondeados === 0 && minutos > 45) {
    hora += 1;
  }
  let dateToday =
    fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();
  let timeToday =
    hora +
    ":" +
    (minutosRedondeados < 10 ? "0" : "") +
    minutosRedondeados +
    ":00.000";

  return (
    <View style={[styles.container, global.bgBlack]}>
      <View style={styles.inputs}>
        <CustomModalDeparture
          control={control}
          name={`departure`}
          label={`Salida`}
          placeholder={`Seleccione su salida`}
          data={venezuela}
        />

        <CustomModalArrival
          control={control}
          name={`arrival`}
          label={`Llegada`}
          placeholder={`Seleccione la llegada`}
          data={venezuela}
        />
      </View>
      <View style={styles.options}>
        <CustomTimeDatePicker
          styled={{
            container: styles.containerDatetime,
            border: styles.borderDatetime,
            text: [styles.textDatetime, global.white],
          }}
        />
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.search, global.mainBgColor]}
          onPress={() => {
            setResult({
              time: route?.time ? route?.time : timeToday,
              date: route?.date ? route?.date : dateToday,
              departureState: route?.departureState?.estado,
              departureCity: route?.departureCity,
              arrivalState: route?.arrivalState?.estado,
              arrivalCity: route?.arrivalCity,
              active: true,
            });
            setLoading(true);
          }}
        >
          <Text style={{
            fontSize: 16,
            fontFamily: 'medium',
            color: '#fff'
          }}>Buscar</Text>
          {/* <Image
            style={{
              width: 32,
              height: 32,
              resizeMode: "cover",
            }}
            source={require("@/utils/images/search-black.png")}
          /> */}
          <EvilIcons name="search" size={30} color="white" style={{marginHorizontal: 5}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RouteSearch;
