<template>
  <div>
    <h1>Сбалансируй свой портфель ETF</h1>

    <div class="wrapper">
      <div>
        <div class="types" v-bind:data-active="view">
          <div
            class="type"
            data-type="mixed"
            :style="{ height: groups.mixed + '%' }"
          ></div>
          <div
            class="type"
            data-type="stocks"
            :style="{ height: groups.stocks + '%' }"
          >
            <div
              class="type-item"
              v-for="market in stocksGroups"
              :key="market.id"
              v-bind:data-item="market.id"
              :style="{ height: stocks[market.id] + '%' }"
            ></div>
          </div>
          <div
            class="type"
            data-type="bonds"
            :style="{ height: groups.bonds + '%' }"
          >
            <div
              class="type-item"
              v-for="market in bondsGroups"
              :key="market.id"
              v-bind:data-item="market.id"
              :style="{ height: bonds[market.id] + '%' }"
            ></div>
          </div>
          <div
            class="type"
            data-type="gold"
            :style="{ height: groups.gold + '%' }"
          ></div>
        </div>

        <button @click="save" type="button" class='save'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z"/></svg>
        </button>
      </div>

      <div class="settings">
        <div class="buttons">
          <button type="button" @click="view = ''" data-type="portfolio">
            Портфель
          </button>

          <button
            v-if="groups.mixed > 0"
            type="button"
            @click="view = 'mixed'"
            data-type="mixed"
          >
            Смешанные активы
          </button>
          <button
            v-if="groups.stocks > 0"
            type="button"
            @click="view = 'stocks'"
            data-type="stocks"
          >
            Акции
          </button>
          <button
            v-if="groups.bonds > 0"
            type="button"
            @click="view = 'bonds'"
            data-type="bonds"
          >
            Облигации
          </button>
          <button
            v-if="groups.gold > 0"
            type="button"
            @click="view = 'gold'"
            data-type="gold"
          >
            Драгоценные металлы
          </button>
        </div>

        <div v-if="!view">
          <table class="general-types">
            <thead>
              <tr>
                <th>Тип активов</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr data-type="mixed">
                <td>Смешанные активы</td>
                <td>
                  <Counter :value="groups.mixed" @input="groups.mixed = $event;recountMixed();" :max="getGroupMax('mixed')"></Counter>
                </td>
              </tr>
              <tr data-type="stocks">
                <td>Акции</td>
                <td>
                  <Counter :value="groups.stocks" @input="groups.stocks = $event;recountStocks();" :max="getGroupMax('stocks')"></Counter>
                </td>
              </tr>
              <tr data-type="bonds">
                <td>Облигации</td>
                <td>
                  <Counter :value="groups.bonds" @input="groups.bonds = $event;recountBonds();" :max="getGroupMax('bonds')"></Counter>
                </td>
              </tr>
              <tr data-type="gold">
                <td>Драг. металлы</td>
                <td>
                  <Counter :value="groups.gold" @input="groups.gold = $event;recountGold();" :max="getGroupMax('gold')"></Counter>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="view">
          <div class="active-section" v-bind:data-type="view">
            <div v-if="view == 'gold'">
              <div class="active-section__header">
                <h2>
                  Драг. металлы <small>({{ groups.gold }}%)</small>
                </h2>
              </div>

              <div class="active-section__description">
                Доля портфеля между выбранными фондами будет разделена поровну
              </div>

              <div class="active-section__content">
                <div class="tickers">
                  <Ticker
                    v-for="etf in getGroup('gold')"
                    :key="etf.ticker"
                    :etf="etf"
                    :class="{
                      active: actives[etf.ticker]
                    }"
                    @click="toggleEtf(etf)"
                  ></Ticker>
                </div>
              </div>
            </div>

            <div v-else-if="view == 'mixed'">
              <div class="active-section__header">
                <h2>
                  Смешанные активы <small>({{ groups.mixed }}%)</small>
                </h2>
              </div>

              <div class="active-section__description">
                смешанные фонды включают в себя акции, облигации и золото. Для
                удобства они вынесены в отдельную группу.
                <br />
                Доля портфеля между выбранными фондами будет разделена поровну.
              </div>

              <div class="active-section__content">
                <div class="tickers">
                  <Ticker
                    v-for="etf in getGroup('mixed')"
                    :key="etf.ticker"
                    :etf="etf"
                    :class="{
                      active: actives[etf.ticker]
                    }"
                    @click="toggleEtf(etf)"
                  ></Ticker>
                </div>
              </div>
            </div>

            <div v-else-if="view == 'bonds'">
              <div class="active-section__header">
                <h2>
                  Облигации <small>({{ groups.bonds }}%)</small>
                </h2>
              </div>

              <div class="active-section__description">
                Распределите долю облигаций в портфеле между облигациями России
                и США. Внутри групп доли между выбранными фондами будут
                распределены поровну.
              </div>

              <table class="general-types">
                <thead>
                  <tr>
                    <th>Рынок</th>
                    <th>%</th>
                    <th width="100%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="market in bondsGroups" :key="market.id">
                    <td>{{ market.name }}</td>
                    <td>
                      <Counter
                        :value="bonds[market.id]"
                        @input="
                          bonds[market.id] = $event;
                          recountBonds();
                        "
                        :max="getBondsMax(market.id)"
                      ></Counter>
                    </td>
                    <td>
                      <div class="tickers">
                        <Ticker
                          v-for="etf in getGroup('bonds').filter(
                            (e) => e.market == market.id
                          )"
                          :key="etf.ticker"
                          :etf="etf"
                          :class="{
                            active: actives[etf.ticker]
                          }"
                          @click="toggleEtf(etf)"
                        ></Ticker>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else-if="view == 'stocks'">
              <div class="active-section__header">
                <h2>
                  Акции <small>({{ groups.stocks }}%)</small>
                </h2>
              </div>

              <div class="active-section__description">
                Распределите долю акций в портфеле между акциями разных рынков.
                Внутри групп доли между выбранными фондами будут распределены
                поровну.
              </div>

              <table class="general-types">
                <thead>
                  <tr>
                    <th>Рынок</th>
                    <th>%</th>
                    <th width="100%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="market in stocksGroups" :key="market.id">
                    <td>{{ market.name }}</td>
                    <td>
                      <Counter
                        :value="stocks[market.id]"
                        @input="
                          stocks[market.id] = $event;
                          recountStocks();
                        "
                        :max="getStocksMax(market.id)"
                      ></Counter>
                    </td>
                    <td>
                      <div class="tickers">
                        <Ticker
                          v-for="etf in getGroup('stocks').filter(
                            (e) => e.market == market.id
                          )"
                          :key="etf.ticker"
                          :etf="etf"
                          :class="{
                            active: actives[etf.ticker]
                          }"
                          @click="toggleEtf(etf)"
                        ></Ticker>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="portfolio-table">
        <h3>В портфеле</h3>
        <table v-bind:data-active="view">
          <tbody>
            <tr
              v-for="etf in activeEtf"
              :key="etf.ticker"
              v-bind:data-type="etf.type"
            >
              <td>{{ etf.ticker }}</td>
              <td align="right">{{ percents[etf.ticker].toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.wrapper {
  --mixed: #a28be8;
  --stocks: #53e3f1;
  --bonds: #5eda5e;
  --gold: #f9d768;

  --mixed-dark: #8c78ca;
  --stocks-dark: #32cad8;
  --bonds-dark: #26a826;
  --gold-dark: #c5a12c;

  display: flex;
  padding: 20px;
  width: 100%;
}
.save {
  width: 80px;
  height: 80px;
  margin-top: 16px;
  border-radius: 5px;
  background: #6f44f3;
  border: none;
  cursor: pointer;

  svg {
    fill: white;
  }
}
.types {
  width: 80px;
  height: 300px;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  background: hsl(0, 0%, 90%);

  .type {
    width: 100%;
    outline-offset: 1px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;

    &[data-type='mixed'] {
      --active-color: var(--mixed);
      background-color: var(--active-color);
    }
    &[data-type='stocks'] {
      --active-color: var(--stocks);
      background-color: var(--active-color);
    }
    &[data-type='bonds'] {
      --active-color: var(--bonds);
      background-color: var(--active-color);
    }
    &[data-type='gold'] {
      --active-color: var(--gold);
      background-color: var(--active-color);
    }
  }

  .type-item {
    display: none;
  }

  &[data-active='mixed'] {
    .type[data-type='mixed'] {
      z-index: 2;
      outline: 3px solid var(--mixed-dark);

      .type-item {
        display: block;
      }
    }
  }

  &[data-active='stocks'] {
    .type[data-type='stocks'] {
      z-index: 2;
      outline: 3px solid var(--stocks-dark);

      .type-item {
        display: block;

        &[data-item]:nth-of-type(odd) {
          background: #8ecbf3;
        }
        &[data-item]:nth-of-type(even) {
          background: #8888f3;
        }
      }
    }
  }

  &[data-active='bonds'] {
    .type[data-type='bonds'] {
      z-index: 2;
      outline: 3px solid var(--bonds-dark);

      .type-item {
        display: block;

        &[data-item]:nth-of-type(odd) {
          background: #4dc291;
        }
        &[data-item]:nth-of-type(even) {
          background: #3d754e;
        }
      }
    }
  }

  &[data-active='gold'] {
    .type[data-type='gold'] {
      outline: 3px solid var(--gold-dark);

      .type-item {
        display: block;
      }
    }
  }
}

.settings {
  flex-grow: 1;
  padding-left: 20px;
  padding-right: 20px;

  .buttons {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;

    button {
      margin: 2px;
      flex-grow: 1;
      color: white;
      height: 32px;
      padding: 0 10px;
      border-radius: 4px;
      border: 0;
      outline: 0;
      cursor: pointer;
    }

    button {
      &[data-type='portfolio'] {
        background: #ccc;
      }

      &[data-type='mixed'] {
        background: var(--mixed-dark);
      }

      &[data-type='stocks'] {
        background: var(--stocks-dark);
      }

      &[data-type='bonds'] {
        background: var(--bonds-dark);
      }

      &[data-type='gold'] {
        background: var(--gold-dark);
      }
    }
  }

  .general-types {
    font-size: 16px;

    td {
      padding: 10px 10px;

      &:first-child {
        font-weight: bold;
      }
    }

    button {
      color: inherit;
      background: currentColor;
      border: none;
      outline: none;
      height: 32px;
      padding: 0 10px;
      border-radius: 4px;
      cursor: pointer;
      span {
        color: white;
      }
      &:hover {
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      }
    }

    [data-type='mixed'] {
      color: var(--mixed-dark);
    }

    [data-type='stocks'] {
      color: var(--stocks-dark);
    }

    [data-type='bonds'] {
      color: var(--bonds-dark);
    }

    [data-type='gold'] {
      color: var(--gold-dark);
    }
  }
}

.tickers {
  display: flex;
  flex-wrap: wrap;
}
.active-section {
  &[data-type='gold'] {
    --active-color: var(--gold-dark);
  }
  &[data-type='stocks'] {
    --active-color: var(--stocks-dark);
  }
  &[data-type='bonds'] {
    --active-color: var(--bonds-dark);
  }
  &[data-type='mixed'] {
    --active-color: var(--mixed-dark);
  }

  h2 {
    color: var(--active-color);
  }

  &__description {
    margin: 12px 0;
  }

  .ticker.active {
    background: var(--active-color);

    .ticker-name {
      color: white;
    }
  }
}
.portfolio-table {
  table {
    td {
      color: inherit;
    }
    &[data-active='mixed'] {
      [data-type='mixed'] {
        background: var(--mixed-dark);
        color: white;
      }
    }

    &[data-active='stocks'] {
      [data-type='stocks'] {
        background: var(--stocks-dark);
        color: white;
      }
    }

    &[data-active='bonds'] {
      [data-type='bonds'] {
        background: var(--bonds-dark);
        color: white;
      }
    }

    &[data-active='gold'] {
      [data-type='gold'] {
        background: var(--gold-dark);
        color: white;
      }
    }
  }
}
</style>

<script>
import Counter from '../Counter';
import Ticker from '../Ticker';

import { url } from '../../config/api';

export default {
  components: { Counter, Ticker },
  created() {
    this.getEtfs().then((list) => (this.etfs = list));
    this.getComposition().then((composition) => {
      let groups = composition.groups;

      this.groups.mixed = parseInt(groups.mixed);
      this.groups.stocks = parseInt(groups.stocks);
      this.groups.bonds = parseInt(groups.bonds);
      this.groups.gold = parseInt(groups.gold);

      this.actives = composition.actives;
      this.percents = composition.percents;

      let bonds = composition.bonds;
      let stocks = composition.stocks;

      this.bonds.usa = parseInt(bonds.usa);
      this.bonds.russia = parseInt(bonds.russia);

      this.stocks.usa = parseInt(stocks.usa);
      this.stocks.russia = parseInt(stocks.russia);
      this.stocks.developed = parseInt(stocks.developed);
      this.stocks.emerging = parseInt(stocks.emerging);
      this.stocks.global = parseInt(stocks.global);
    });
  },
  data() {
    return {

      stocksGroups: [
        { id: 'russia', name: 'Россия' },
        { id: 'usa', name: 'США' },
        { id: 'developed', name: 'Развитые' },
        { id: 'emerging', name: 'Развивающиеся' },
        { id: 'global', name: 'Глобальный' },
      ],

      bondsGroups: [
        { id: 'russia', name: 'Россия' },
        { id: 'usa', name: 'США' }
      ],

      etfs: [],
      actives: {},
      percents: {},

      bonds: {
        russia: 0,
        usa: 0
      },
      stocks: {
        global: 0,
        usa: 0,
        russia: 0,
        developed: 0,
        emerging: 0,
      },

      view: '',
      groups: {
        mixed: 0,
        stocks: 0,
        bonds: 0,
        gold: 0
      }
    };
  },
  computed: {
    activeEtf() {
      return this.etfs.filter(
        (e) => this.actives[e.ticker] && this.percents[e.ticker] > 0
      );
    }
  },
  methods: {
    getGroupMax(group) {
      let result = 100;
      Object.keys(this.groups).forEach(key => {
        if (key != group) result -= this.groups[key];
      });
      return result;
    },
    getGroup(group) {
      return this.etfs.filter((e) => e.type == group);
    },
    getBondsMax(market) {
      let result = 100;
      Object.keys(this.bonds).forEach((key) => {
        if (key != market) result -= this.bonds[key];
      });
      return result;
    },
    getStocksMax(market) {
      let result = 100;
      Object.keys(this.stocks).forEach((key) => {
        if (key != market) result -= this.stocks[key];
      });
      return result;
    },
    recountGold() {
      let etfs = this.etfs.filter((e) => e.type == 'gold');
      let activeEtfs = etfs.filter((e) => this.actives[e.ticker]);

      let count = activeEtfs.length;
      let goldPercent = this.groups.gold;

      etfs.forEach((e) => {
        if (this.actives[e.ticker]) {
          this.percents[e.ticker] = goldPercent / count;
        } else {
          this.percents[e.ticker] = 0;
        }
      });
    },
    recountMixed() {
      let etfs = this.etfs.filter((e) => e.type == 'mixed');
      let activeEtfs = etfs.filter((e) => this.actives[e.ticker]);

      let count = activeEtfs.length;
      let mixedPercent = this.groups.mixed;

      etfs.forEach((e) => {
        if (this.actives[e.ticker]) {
          this.percents[e.ticker] = mixedPercent / count;
        } else {
          this.percents[e.ticker] = 0;
        }
      });
    },
    recountBonds() {
      let etfs = this.etfs.filter((e) => e.type == 'bonds');
      let bondsPercent = this.groups.bonds;

      let recountGroup = (market) => {
        let groupEtfs = etfs.filter((e) => e.market == market);
        let activeEtfs = groupEtfs.filter((e) => this.actives[e.ticker]);
        let count = activeEtfs.length;
        let percent = (bondsPercent * this.bonds[market]) / 100;
        groupEtfs.forEach((e) => {
          if (this.actives[e.ticker]) {
            this.percents[e.ticker] = percent / count;
          } else {
            this.percents[e.ticker] = 0;
          }
        });
      };

      recountGroup('russia');
      recountGroup('usa');
    },
    recountStocks() {
      let etfs = this.etfs.filter((e) => e.type == 'stocks');
      let stocksPercent = this.groups.stocks;


      let recountGroup = (market) => {
        let groupEtfs = etfs.filter((e) => e.market == market);
        let activeEtfs = groupEtfs.filter((e) => this.actives[e.ticker]);
        let count = activeEtfs.length;
        let percent = (stocksPercent * this.stocks[market]) / 100;
        console.log('market', count, percent)
        groupEtfs.forEach((e) => {
          if (this.actives[e.ticker]) {
            this.percents[e.ticker] = percent / count;
          } else {
            this.percents[e.ticker] = 0;
            this.actives[e.ticker] = 0;
          }
        });
      };

      recountGroup('russia');
      recountGroup('usa');
      recountGroup('developed');
      recountGroup('emerging');
      recountGroup('global');
    },
    toggleEtf(etf) {
      if (this.actives[etf.ticker]) {
        this.actives[etf.ticker] = 0;
      } else {
        this.actives[etf.ticker] = 1;
      }

      if (etf.type == 'gold') this.recountGold();
      if (etf.type == 'mixed') this.recountMixed();
      if (etf.type == 'bonds') this.recountBonds();
      if (etf.type == 'stocks') this.recountStocks();
    },
    getEtfs() {
      return fetch(`${url}/etfs`, {
        method: 'GET'
      })
        .then((res) => res.json())
        .then((json) => {
          let etfsList = json.etfs;
          etfsList.sort((a, b) => {
            return a.ticker < b.ticker ? -1 : 1;
          });
          return etfsList;
        });
    },
    getComposition() {
      return fetch(`${url}/composition`)
        .then((res) => res.json())
        .then((json) => json.composition);
    },
    save() {
      let data = {
        groups: this.groups,
        stocks: this.stocks,
        bonds: this.bonds,
        actives: this.actives,
        percents: this.percents
      };

      fetch(`${url}/composition`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
};
</script>
