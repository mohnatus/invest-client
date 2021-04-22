<template>
  <div class="wrapper">
    <Percents :etfs="etfs" :percents="percents"></Percents>

    <div class="calculation">
      <div class="groups">
        <div class="groups-col">
          <section class="group">
            <div class="group-header">
              <div class="group-percent">
                <input type="number" v-model="groups.stocks" />
              </div>
              <h2 class="group-name">Акции</h2>
            </div>

            <div class="group-content">
              <Stocks :groups="stocksGroups" :items="items.stocks"></Stocks>



            </div>
          </section>
        </div>

        <div class="groups-col">
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
                          v-for="etf in items.bonds.usa.filter((i) => i.active)"
                          :key="etf.ticker"
                          :etf="etf"
                        >
                          {{ etf.ticker }}
                        </Ticker>
                        <Ticker
                          v-for="etf in items.bonds.usa.filter(
                            (i) => !i.active
                          )"
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
                          v-for="etf in items.bonds.russia.filter(
                            (i) => i.active
                          )"
                          :key="etf.ticker"
                          :etf="etf"
                        >
                          {{ etf.ticker }}
                        </Ticker>
                        <Ticker
                          v-for="etf in items.bonds.russia.filter(
                            (i) => !i.active
                          )"
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
                <input type="number" v-model="groups.mixed" />
              </div>
              <h2 class="group-name">Смешанные активы</h2>
            </div>

            <div class="group-content">
              <div class="tickers-list">
                <Ticker
                  v-for="etf in items.mixed.filter((i) => i.active)"
                  :key="etf.ticker"
                  :etf="etf"
                >
                  {{ etf.ticker }}
                </Ticker>
                <Ticker
                  v-for="etf in items.mixed.filter((i) => !i.active)"
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
                <input type="number" v-model="groups.gold" />
              </div>
              <h2 class="group-name">Золото/серебро</h2>
            </div>

            <div class="group-content">
              <div class="tickers-list">
                <Ticker
                  v-for="etf in items.gold.filter((i) => i.active)"
                  :key="etf.ticker"
                  :etf="etf"
                >
                  {{ etf.ticker }}
                </Ticker>
                <Ticker
                  v-for="etf in items.gold.filter((i) => !i.active)"
                  :key="etf.ticker"
                  :etf="etf"
                >
                  {{ etf.ticker }}
                </Ticker>
              </div>
            </div>
          </section>
        </div>

        <div class="groups-footer">
          <div class="groups-total">
            {{ groupsSum }}
          </div>
        </div>
      </div>

      <div>
        <button type="button" @click="save">Сохранить</button>
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

.calculation {
  margin-left: 24px;
}
.groups {
  display: flex;
  flex-wrap: wrap;
  th,
  td {
    border: 1px solid black;
  }
  &-col {
    padding: 10px;
    width: 50%;
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
import Percents from './percents.vue';
import Stocks from './stocks.vue';
import { Chart } from 'highcharts-vue';
import { url } from '../../config/api';

let etfsList = etfs.map((e) => new ETF(e));
etfsList.sort((a, b) => {
  return a.ticker < b.ticker ? -1 : 1;
});

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
  { id: 'gold', name: 'Золото' }
];

const markets = [
  { id: 'global', name: 'Глобальный рынок' },
  { id: 'usa', name: 'США' },
  { id: 'developed', name: 'Развитые' },
  { id: 'russia', name: 'Россия' },
  { id: 'emerging', name: 'Развивающиеся' }
];

function getGroup(type, market) {
  let etfs = etfsList.filter((e) => {
    if (e.type !== type) return false;
    if (market && e.market != market) return false;
    return true;
  });
  return [...etfs.filter((e) => e.active), ...etfs.filter((e) => !e.active)];
}

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
  components: { Ticker, highcharts: Chart, Percents, Stocks },
  data() {
    return {
      etfs: etfsList,

      active: {},

      groups: {
        stocks: 0,
        bonds: 0,
        gold: 0,
        mixed: 0
      },
      bondsGroups: {
        usa: 0,
        russia: 0
      },
      stocksGroups: {
        global: 0,
        usa: 0,
        developed: 0,
        russia: 0,
        emerging: 0,
        other: 0
      },

      items: {
        gold: getGroup('gold'),
        mixed: getGroup('mixed'),
        bonds: {
          usa: getGroup('bonds', 'usa'),
          russia: getGroup('bonds', 'russia')
        },
        stocks: {
          usa: getGroup('stocks', 'usa'),
          russia: getGroup('stocks', 'russia'),
          developed: getGroup('stocks', 'developed'),
          emerging: getGroup('stocks', 'emerging'),
          global: getGroup('stocks', 'global'),
          other: getGroup('stocks', 'other')
        }
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
    let data = localStorage.getItem('portfolio-composition');

    if (data) {
      data = JSON.parse(data);
      if (data.groups) {
        Object.keys(data.groups).forEach((key) => {
          this.groups[key] = data.groups[key] || 0;
        });
      }

      if (data.stocks) {
        Object.keys(data.stocks).forEach((key) => {
          this.stocksGroups[key] = data.stocks[key] || 0;
        });
      }

      if (data.bonds) {
        Object.keys(data.bonds).forEach((key) => {
          this.bondsGroups[key] = data.bonds[key] || 0;
        });
      }

      if (data.actives) {
        this.etfs.forEach((e) => {
          e.active = data.actives[e.ticker];
        });
      }
    }

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
    typesChartOptions() {
      let stockes = 0;
      let bonds = 0;
      let gold = 0;

      this.etfs
        .filter((e) => e.active)
        .forEach((e) => {
          let percent = this.percents[e.ticker];
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
            .reduce((total, etf) => total + this.percents[etf.ticker], 0)
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
            .reduce((total, etf) => total + this.percents[etf.ticker], 0)
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

  

    bondsSum() {
      return Object.values(this.bondsGroups).reduce(
        (acc, v) => acc + parseInt(v),
        0
      );
    },

    groupsSum() {
      return Object.values(this.groups).reduce(
        (acc, v) => acc + parseInt(v),
        0
      );
    },

    percents() {
      let res = {};

      (() => {
        let percent = this.groups.stocks;
        Object.keys(this.stocksGroups).forEach((key) => {
          let groupPercent = (this.stocksGroups[key] * percent) / 100;

          let items = this.items.stocks[key];
          let activeItems = items.filter((i) => i.active);
          let inactiveItems = items.filter((i) => !i.active);

          let count = activeItems.length;

          activeItems.forEach((item) => {
            res[item.ticker] = groupPercent / count;
          });
          inactiveItems.forEach((item) => {
            res[item.ticker] = 0;
          });
        });
      })();

      (() => {
        let percent = this.groups.bonds;
        Object.keys(this.bondsGroups).forEach((key) => {
          let groupPercent = (this.bondsGroups[key] * percent) / 100;

          let items = this.items.bonds[key];
          let activeItems = items.filter((i) => i.active);
          let inactiveItems = items.filter((i) => !i.active);

          let count = activeItems.length;

          activeItems.forEach((item) => {
            res[item.ticker] = groupPercent / count;
          });
          inactiveItems.forEach((item) => {
            res[item.ticker] = 0;
          });
        });
      })();

      (() => {
        let groupPercent = this.groups.gold;
        let items = this.items.gold;
        let activeItems = items.filter((i) => i.active);
        let inactiveItems = items.filter((i) => !i.active);
        let count = activeItems.length;
        activeItems.forEach((item) => {
          res[item.ticker] = groupPercent / count;
        });
        inactiveItems.forEach((item) => {
          res[item.ticker] = 0;
        });
      })();

      (() => {
        let groupPercent = this.groups.mixed;
        let items = this.items.mixed;
        let activeItems = items.filter((i) => i.active);
        let inactiveItems = items.filter((i) => !i.active);
        let count = activeItems.length;
        activeItems.forEach((item) => {
          res[item.ticker] = groupPercent / count;
        });
        inactiveItems.forEach((item) => {
          res[item.ticker] = 0;
        });
      })();

      return res;
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
    },

    save() {
      let data = {
        groups: this.groups,
        stocks: this.stocksGroups,
        bonds: this.bondsGroups,
        actives: {}
      };
      this.etfs.forEach((e) => {
        data.actives[e.ticker] = e.active ? 1 : 0;
      });
      localStorage.setItem('portfolio-composition', JSON.stringify(data));
    }
  }
};
</script>
