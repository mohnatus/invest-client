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
              inactive: !etf.active
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
        <section class="group">
          <div class="group-header">
            <div class="group-percent">
              <input type="number" v-model="groups.mixed" />
            </div>
            <h2 class="group-name">Смешанные активы</h2>
          </div>

          <div class="group-content">
            <div class="tickers-list">
              <Ticker
                v-for="etf in getGroup('mixed')"
                :key="etf.ticker"
                :etf="etf"
              >
                {{ etf.ticker }}
              </Ticker>
            </div>
          </div>
        </section>

        <section class="group">
          <div class="group-header">
            <div class="group-percent">
              <input type="number" v-model="groups.stocks" />
            </div>
            <h2 class="group-name">Акции</h2>
          </div>

          <div class="group-content">
            <table>
              <tbody>
                <tr>
                  <th>Глобальный<br />рынок</th>
                  <td>
                    <input type="number" v-model="stocksGroups.global" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('stocks', 'global')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>США</th>
                  <td>
                    <input type="number" v-model="stocksGroups.usa" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('stocks', 'usa')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Россия</th>
                  <td>
                    <input type="number" v-model="stocksGroups.russia" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('stocks', 'russia')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Развитые<br />рынки</th>
                  <td>
                    <input type="number" v-model="stocksGroups.developed" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('stocks', 'developed')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Развивающиеся<br />рынки</th>
                  <td>
                    <input type="number" v-model="stocksGroups.developed" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('stocks', 'emerging')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Другое</th>
                  <td>
                    <input type="number" v-model="stocksGroups.other" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('stocks', 'other')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td>
                    {{ stocksSum }}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="group">
          <div class="group-header">
            <div class="group-percent">
              <input type="number" v-model="groups.bonds" />
            </div>
            <h2 class="group-name">Облигации</h2>
          </div>

          <div class="group-content">
            <table>
              <tbody>
                <tr>
                  <th>США</th>
                  <td>
                    <input type="number" v-model="bondsGroups.usa" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('bonds', 'usa')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Россия</th>
                  <td>
                    <input type="number" v-model="bondsGroups.russia" />
                  </td>
                  <td>
                    <div class="tickers-list">
                      <Ticker
                        v-for="etf in getGroup('bonds', 'russia')"
                        :key="etf.ticker"
                        :etf="etf"
                      >
                        {{ etf.ticker }}
                      </Ticker>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th></th>
                  <td>
                    {{ bondsSum }}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="group">
          <div class="group-header">
            <div class="group-percent">
              <input type="number" v-model="groups.gold" />
            </div>
            <h2 class="group-name">Золото/серебро</h2>
          </div>

          <div class="group-content">
            <div class="tickers-list">
              <Ticker
                v-for="etf in getGroup('gold')"
                :key="etf.ticker"
                :etf="etf"
              >
                {{ etf.ticker }}
              </Ticker>
            </div>
          </div>
        </section>

        <div class="groups-footer">
          <div class="groups-total">
            {{ groupsSum }}
          </div>
        </div>
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
.group {
  margin-bottom: 20px;
  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  &-percent {
    width: 60px;
    margin-right: 20px;
    input {
      width: 100%;
    }
  }
  &-content {
    padding-left: 80px;
  }
}
.groups-footer {
  margin-bottom: 24px;
}
</style>

<script>
import { etfs } from './etfs';
import { ETF } from './etf';
import Ticker from './ticker.vue';
import { Chart } from 'highcharts-vue';
import { url } from '../../config/api';

const etfsList = etfs.map((e) => new ETF(e));

const currencies = [
  {
    id: 'RUB'
  },
  {
    id: 'USD'
  },
  {
    id: 'EUR'
  }
];

const types = [
  { id: 'stocks', name: 'Акции' },
  { id: 'bonds', name: 'Облигации' },
  { id: 'mixed', name: 'Смешанные активы' },
  { id: 'gold', name: 'Золото' },
];

const markets = [
  { id: 'global', name: 'Глобальный рынок' },
  { id: 'usa', name: 'США' },
  { id: 'developed', name: 'Развитые' },
  { id: 'russia', name: 'Россия' },
  { id: 'emerging', name: 'Развивающиеся' },
  { id: 'other', name: 'Другое' },
];

function PieChart(config) {
  return {
    chart: { type: 'pie' },
    title: {
      text: config.title
    },
    plotOptions: {
      pie: {
        size: 200
      }
    },

    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        return `${this.key}: ${this.y}%`;
      }
    },
    series: config.series
  };
}

export default {
  components: { Ticker, highcharts: Chart },
  data() {
    return {
      etfs: etfsList,
      groups: {
        stocks: 70,
        bonds: 20,
        gold: 5,
        mixed: 5
      },
      bondsGroups: {
        usa: 50,
        russia: 50
      },
      stocksGroups: {
        global: 5,
        usa: 20,
        developed: 20,
        russia: 20,
        emerging: 20,
        other: 20
      },
      types,
      markets,
      chartOptions: {
        chart: {
          type: 'pie'
        },
        series: [
          {
            name: 'hello',
            data: [
              {
                name: 'dsf',
                y: 100
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    fetch(`${url}/etfs`)
      .then((response) => response.json())
      .then((json) => {
        let etfs = json.etfs.instruments.filter(({ ticker }) => {
          return !this.etfs.some((e) => e.ticker == ticker);
        });
        console.log('Не описанные ETF', etfs);
      });
  },
  computed: {
    sortedEtfs() {
      return [
        ...this.etfs.filter((e) => e.active),
        ...this.etfs.filter((e) => !e.active)
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
        title: 'Тип активов',
        series: [
          {
            name: '',
            data: [
              {
                name: 'Акции',
                y: stockes
              },
              {
                name: 'Облигации',
                y: bonds
              },
              {
                name: 'Золото',
                y: gold
              }
            ]
          }
        ]
      });
    },

    marketsChartOptions() {
      let activeEtfs = this.etfs.filter((e) => e.active);

      let data = markets.map((market) => {
        return {
          name: market.name,
          y: activeEtfs
            .filter((etf) => etf.market == market.id)
            .reduce((total, acc) => total + acc.percent, 0)
        };
      });

      return PieChart({
        title: 'Рынки активов',
        series: [
          {
            name: '',
            data: data
          }
        ]
      });
    },

    currencyChartOptions() {
      let activeEtfs = this.etfs.filter((e) => e.active);

      let data = currencies.map((cur) => {
        return {
          name: cur.id,
          y: activeEtfs
            .filter((etf) => etf.currency.toUpperCase() == cur.id)
            .reduce((total, acc) => total + acc.percent, 0)
        };
      });

      return PieChart({
        title: 'Валюта',
        series: [
          {
            name: '',
            data: data
          }
        ]
      });
    },

    total() {
      return this.etfs.reduce((acc, etf) => etf.percent + acc, 0);
    },

    stocksSum() {
      return Object.values(this.stocksGroups).reduce((acc, v) => acc + parseInt(v), 0)
    },

    bondsSum() {
      return Object.values(this.bondsGroups).reduce((acc, v) => acc + parseInt(v), 0)
    },

    groupsSum() {
      return Object.values(this.groups).reduce((acc, v) => acc + parseInt(v), 0)
    }
  },

  methods: {
    getGroup(type, market) {
      let etfs = etfsList.filter((e) => {
        if (e.type !== type) return false;
        if (market && e.market != market) return false;
        return true;
      });
      return [
        ...etfs.filter((e) => e.active),
        ...etfs.filter((e) => !e.active)
      ];
    }
  }
};
</script>
