<template>
  <div>
    <h1>Сбалансируй свой портфель ETF</h1>

    <div class="wrapper">
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
        ></div>
        <div
          class="type"
          data-type="bonds"
          :style="{ height: groups.bonds + '%' }"
        ></div>
        <div
          class="type"
          data-type="gold"
          :style="{ height: groups.gold + '%' }"
        ></div>
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
                  <Counter v-model="groups.mixed" :max="maxMixed"></Counter>
                </td>
              </tr>
              <tr data-type="stocks">
                <td>Акции</td>
                <td>
                  <Counter v-model="groups.stocks" :max="maxStocks"></Counter>
                </td>
              </tr>
              <tr data-type="bonds">
                <td>Облигации</td>
                <td>
                  <Counter v-model="groups.bonds" :max="maxBonds"></Counter>
                </td>
              </tr>
              <tr data-type="gold">
                <td>Драг. металлы</td>
                <td>
                  <Counter v-model="groups.gold" :max="maxGold"></Counter>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="view">
          <div class="active-section" v-bind:data-type="view">

            <div v-if="view == 'gold'">
              <div class="active-section__header">
                <h2>Драг. металлы <small>({{ groups.gold }}%)</small></h2>
              </div>

              <div class="active-section__description">
                Доля портфеля между выбранными фондами будет разделена поровну
              </div>

              <div class="active-section__content">
                <div class="tickers">
                  <Ticker
                    v-for="etf in etfsGold"
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
                <h2>Смешанные активы <small>({{ groups.mixed }}%)</small></h2>
              </div>

              <div class="active-section__description">
                смешанные фонды включают в себя акции, облигации и золото. Для удобства они вынесены в отдельную группу.
                <br>
                Доля портфеля между выбранными фондами будет разделена поровну.
              </div>

              <div class="active-section__content">
                <div class="tickers">
                  <Ticker
                    v-for="etf in etfsMixed"
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

          </div>
        </div>
      </div>

      <div class="portfolio-table">
        <h3>В портфеле</h3>
        <table v-bind:data-active="view">
          <tbody>
            <tr v-for="etf in activeEtf" :key="etf.ticker" v-bind:data-type="etf.type">
              <td>{{ etf.ticker }}</td>
              <td align="right">{{ percents[etf.ticker].toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
.types {
  width: 80px;
  height: 300px;

  display: flex;
  flex-direction: column;
  background: hsl(0, 0%, 90%);

  .type {
    width: 100%;
    outline-offset: 1px;
    position: relative;
    z-index: 1;

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

  &[data-active="mixed"] {
    .type[data-type='mixed'] {
      z-index: 2;
      outline: 3px solid var(--mixed-dark);
    }
  }

  &[data-active="stocks"] {
    .type[data-type='stocks'] {
      z-index: 2;
      outline: 3px solid var(--stocks-dark);
    }
  }

  &[data-active="bonds"] {
    .type[data-type='bonds'] {
      z-index: 2;
      outline: 3px solid var(--bonds-dark);
    }
  }

  &[data-active="gold"] {
    .type[data-type='gold'] {
      outline: 3px solid var(--gold-dark);
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
  }
}
.portfolio-table {
  table {
    td {
      color: inherit;
    }
    &[data-active="mixed"] {
      [data-type="mixed"] {
        background: var(--mixed-dark);
        color: white;
      }
    }

    &[data-active="stocks"] {
      [data-type="stocks"] {
        background: var(--stocks-dark);
        color: white;
      }
    }

    &[data-active="bonds"] {
      [data-type="bonds"] {
        background: var(--bonds-dark);
        color: white;
      }
    }

    &[data-active="gold"] {
      [data-type="gold"] {
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

      this.groups.mixed = parseFloat(groups.mixed);
      this.groups.stocks = parseFloat(groups.stocks);
      this.groups.bonds = parseFloat(groups.bonds);
      this.groups.gold = parseFloat(groups.gold);

      this.actives = composition.actives;
      this.percents = composition.percents;
    });
  },
  data() {
    return {
      etfs: [],
      actives: {},
      percents: {},
      view: '',
      groups: {
        mixed: 10,
        stocks: 60,
        bonds: 20,
        gold: 10
      }
    };
  },
  computed: {
    maxMixed() {
      return 100 - this.groups.stocks - this.groups.bonds - this.groups.gold;
    },
    maxStocks() {
      return 100 - this.groups.mixed - this.groups.bonds - this.groups.gold;
    },
    maxBonds() {
      return 100 - this.groups.stocks - this.groups.mixed - this.groups.gold;
    },
    maxGold() {
      return 100 - this.groups.stocks - this.groups.bonds - this.groups.mixed;
    },
    etfsGold() {
      return this.etfs.filter((e) => e.type == 'gold');
    },
    etfsMixed() {
      return this.etfs.filter((e) => e.type == 'mixed');
    },
    activeEtf() {
      return this.etfs.filter((e) => this.actives[e.ticker]);
    },
    activeGold() {}
  },
  methods: {
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
    toggleEtf(etf) {
      if (this.actives[etf.ticker]) {
        this.actives[etf.ticker] = 0;
      } else {
        this.actives[etf.ticker] = 1;
      }

      if (etf.type == 'gold') this.recountGold();
      if (etf.type == 'mixed') this.recountMixed();
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
    }
  }
};
</script>
