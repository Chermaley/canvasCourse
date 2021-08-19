import {getChartData} from "./data/data";
import {chart} from "./chart";

const {init} = chart(document.getElementById('chart'), getChartData())

init()