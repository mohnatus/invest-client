<template>
  <div class="wrapper">
    <div class="table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Тикер</th>
            <th></th>
            <th>{{ total }}%</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="etf in sortedEtfs"
            :key="etf.ticker"
            :class="{
              inactive: !etf.active,
            }"
          >
            <td>
              <input
                type="checkbox"
                :checked="etf.active"
                @change="etf.toggle()"
              />
            </td>
            <td>{{ etf.ticker }}</td>
            <td>
              <div class="currency" :class="'currency--' + etf.currency">
                {{ etf.currencySymbol }}
              </div>
            </td>
            <td>
              {{ etf.percent }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div class="groups">
        <table>
          <thead>
            <tr>
              <th></th>
              <th v-for="type in types" :key="type.id">{{ type.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="market in markets" :key="market.id">
              <th>{{ market.name }}</th>
              <td v-for="type in types" :key="type.id">
                <div class="tickers-list">
                  <Ticker
                    v-for="etf in getGroup(type.id, market.id)"
                    :key="etf.ticker"
                    :etf="etf"
                  >
                    {{ etf.ticker }}
                  </Ticker>
                </div>
              </td>
            </tr>
            <tr>
              <th>Золото</th>
              <td :colspan="types.length">
                <div class="tickers-list">
                  <Ticker
                    v-for="etf in getGroup('gold')"
                    :key="etf.ticker"
                    :etf="etf"
                  >
                    {{ etf.ticker }}
                  </Ticker>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="charts">
        <div class="chart">
          <highcharts :options="typesChartOptions"></highcharts>
        </div>
        <div class="chart">
          <highcharts :options="marketsChartOptions"></highcharts>
        </div>
        <div class="chart">
          <highcharts :options="currencyChartOptions"></highcharts>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.wrapper {
  display: flex;
}
.table {
  tr {
    &.inactive {
      opacity: 0.5;
    }
  }
}
.groups {
  th,
  td {
    border: 1px solid black;
  }
}
.tickers-list {
  display: flex;
  flex-wrap: wrap;
}
.charts {
  display: flex;
  flex-wrap: wrap;

  .chart {
    min-width: 400px;
  }
}
</style>

<script>
import { etfs } from "./etfs";
import { ETF } from "./etf";
import Ticker from "./ticker.vue";
import { Chart } from "highcharts-vue";

const etfsList = etfs.map((e) => new ETF(e));
export const currencies = [
  {
    id: "RUB",
  },
  {
    id: "USD",
  },
  {
    id: "EUR",
  },
];

export const types = [
  { id: "mixed", name: "Смеш." },
  { id: "stocks", name: "Акции" },
  { id: "bonds", name: "Облигации" },
];

export const markets = [
  { id: "global", name: "Глобальный рынок" },
  { id: "usa", name: "США" },
  { id: "developed", name: "Развитые" },
  { id: "russia", name: "Россия" },
  { id: "emerging", name: "Развивающиеся" },
];

function PieChart(config) {
  return {
    chart: { type: "pie" },
    title: {
      text: config.title,
    },
    plotOptions: {
      pie: {
        size: 200,
      },
    },

    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return `${this.key}: ${this.y}%`;
      },
    },
    series: config.series,
  };
}

export default {
  components: { Ticker, highcharts: Chart },
  data() {
    return {
      etfs: etfsList,
      types,
      markets,
      chartOptions: {
        chart: {
          type: "pie",
        },
        series: [
          {
            name: "hello",
            data: [
              {
                name: "dsf",
                y: 100,
              },
            ],
          },
        ],
      },
    };
  },

  computed: {
    sortedEtfs() {
      return [
        ...this.etfs.filter((e) => e.active),
        ...this.etfs.filter((e) => !e.active),
      ];
    },

    typesChartOptions() {
      let stockes = 0;
      let bonds = 0;
      let gold = 0;

      this.etfs
        .filter((e) => e.active)
        .forEach((e) => {
          let percent = e.percent;
          let actives = e.actives;

          stockes += ((actives.stocks || 0) * percent) / 100;
          bonds += ((actives.bonds || 0) * percent) / 100;
          gold += ((actives.gold || 0) * percent) / 100;
        });

      return PieChart({
        title: "Тип активов",
        series: [
          {
            name: "",
            data: [
              {
                name: "Акции",
                y: stockes,
              },
              {
                name: "Облигации",
                y: bonds,
              },
              {
                name: "Золото",
                y: gold,
              },
            ],
          },
        ],
      });
    },

    marketsChartOptions() {
      let activeEtfs = this.etfs.filter((e) => e.active);

      let data = markets.map((market) => {
        return {
          name: market.name,
          y: activeEtfs
            .filter((etf) => etf.market == market.id)
            .reduce((total, acc) => total + acc.percent, 0),
        };
      });

      return PieChart({
        title: "Рынки активов",
        series: [
          {
            name: "",
            data: data,
          },
        ],
      });
    },

    currencyChartOptions() {
      let activeEtfs = this.etfs.filter((e) => e.active);

      let data = currencies.map((cur) => {
        return {
          name: cur.id,
          y: activeEtfs
            .filter((etf) => etf.currency.toUpperCase() == cur.id)
            .reduce((total, acc) => total + acc.percent, 0),
        };
      });

      return PieChart({
        title: "Валюта",
        series: [
          {
            name: "",
            data: data,
          },
        ],
      });
    },

    total() {
      return this.etfs.reduce((acc, etf) => etf.percent + acc, 0);
    },
  },

  methods: {
    getGroup(type, market) {
      let etfs = this.etfs.filter((e) => {
        if (e.type !== type) return false;
        if (market && e.market != market) return false;
        return true;
      });
      console.log("grput", type, market, this.etfs.length, etfs);
      return [
        ...etfs.filter((e) => e.active),
        ...etfs.filter((e) => !e.active),
      ];
    },
  },
};
</script>