<template>
  <div>
    <div>
      <button @click="create()">Добавить</button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th width="20"  @click="sort('currency')" class="sorted">
              <span v-if="order=='currency' && !desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 21l12-18 12 18z"/></svg>
              </span>
              <span v-if="order=='currency' && desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M24 3l-12 18-12-18z"/></svg>
              </span>
            </th>
            <th align="left" width="60" @click="sort('ticker')" class="sorted">Тикер
              <span v-if="order=='ticker' && !desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 21l12-18 12 18z"/></svg>
              </span>
              <span v-if="order=='ticker' && desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M24 3l-12 18-12-18z"/></svg>
              </span>
            </th>
            <th align="left" width="100">Название</th>
            <th align="left" width="100" @click="sort('actives')"  class="sorted">Активы
              <span v-if="order=='actives' && !desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 21l12-18 12 18z"/></svg>
              </span>
              <span v-if="order=='actives' && desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M24 3l-12 18-12-18z"/></svg>
              </span>
            </th>
            <th align="left" width="300" >Описание</th>
            <th align="left" width="120"  @click="sort('manager')"  class="sorted">УК
              <span v-if="order=='manager' && !desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 21l12-18 12 18z"/></svg>
              </span>
              <span v-if="order=='manager' && desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M24 3l-12 18-12-18z"/></svg>
              </span>
            </th>
            <th align="left" width="120"  @click="sort('market')"  class="sorted">Рынок
              <span v-if="order=='market' && !desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M0 21l12-18 12 18z"/></svg>
              </span>
              <span v-if="order=='market' && desc">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M24 3l-12 18-12-18z"/></svg>
              </span>
            </th>
            <th width="40"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="etf of sortedEtfs"
            :key="etf.ticker"
            class="etf-row"
            :class="'etf-row--' + etf.type"
          >
            <td>
              <span
                class="currency currency--rub"
                title="Российский рубль"
                v-if="etf.currency.toUpperCase() == 'RUB'"
                >₽</span
              >
              <span
                class="currency currency--eur"
                title="Евро"
                v-else-if="etf.currency.toUpperCase() == 'EUR'"
                >€</span
              >
              <span
                class="currency currency--usd"
                title="Доллар США"
                v-else-if="etf.currency.toUpperCase() == 'USD'"
                >$</span
              >
            </td>
            <td>
              <b>
                <a v-if="etf.link" :href="etf.link">{{ etf.ticker }}</a>
                <span v-else>{{ etf.ticker }}</span>
              </b>
            </td>
            <td>
              <b>{{ etf.name }}</b>
            </td>
            <td>
              <span v-if="etf.type == 'stocks'">Акции</span>
              <span v-else-if="etf.type == 'bonds'">Облигации</span>
              <span v-else-if="etf.type == 'mixed'">Смешанные</span>
              <span v-else-if="etf.type == 'gold'">Драг. металлы</span>
            </td>
            <td>{{ etf.description }}</td>
            <td>
              <i>{{ etf.manager }}</i>
            </td>
            <td>
              <span v-if="etf.market == 'global'">Глобал.</span>
              <span v-else-if="etf.market == 'usa'">США</span>
              <span v-else-if="etf.market == 'russia'">Россия</span>
              <span v-else-if="etf.market == 'developed'">Развитые</span>
              <span v-else-if="etf.market == 'emerging'">Развивающ.</span>
              <span v-else-if="etf.market == 'gold'">Драг. металлы</span>
            </td>
            <td>
              <div class="etf-actions">
                <button @click="update(etf)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/></svg>
                </button>
                <br />
                <button @click="remove(etf)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <button @click="create()">Добавить</button>
    </div>

    <div class="form">
      <EtfForm ref="form" @create="onCreate" @update="onUpdate"></EtfForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  max-width: 100%;
  overflow: auto;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
}
th {
  white-space: nowrap;
  span {
    margin-left: 5px;
  }
  &.sorted {
    cursor: pointer;
  }
}
td,
th {
  padding: 2px 5px;
}
.etf-row {
  &--stocks {
    background: hsla(125, 100%, 50%, 0.1);
  }
  &--gold {
    background: hsla(60, 100%, 50%, 0.1);
  }
  &--bonds {
    background: hsla(0, 100%, 50%, 0.1);
  }
  &--mixed {
    background: hsla(175, 100%, 50%, 0.1);
  }
}
.etf {

  &-actions {
    display: flex;
    button {
      margin: 0 4px;
      padding: 5px;
      font-size: 0;
    }
  }
}
</style>

<script>
import { url } from '../../config/api';
import EtfForm from './form.vue';

const actives = {
  stocks: 1, // акции
  bonds: 3, // облигации
  mixed: 4, // смешанные
  gold: 2, // драг. металлы
}

const markets = {
  global: 1,// Глобальный
  usa: 6, // сша
  russia: 5, // россия
  developed: 4, // развитые
  emerging: 3, // развивающиеся
  gold: 2, // драг. металлы
}

export default {
  components: { EtfForm },
  data() {
    return {
      etfs: [],
      order: 'ticker',
      desc: false
    };
  },
  created() {
    fetch(`${url}/etfs`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((json) => {
        this.etfs = json.etfs;
      });

    fetch(`${url}/tinkoff-etfs`)
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
      let etfs = [...this.etfs];

      let order = this.order;
      let desc = this.desc ? -1 : 1;

      if (order == 'ticker') {
        etfs.sort((a, b) => {
          let diff = a.ticker < b.ticker ? -1 : 1;
          return diff * desc;
        })
      } else if (order == 'actives') {
        etfs.sort((a, b) => {
          let diff = actives[a.type] < actives[b.type] ? -1 : 1;
          return diff * desc;
        })
      } else if (order == 'market') {
        etfs.sort((a, b) => {
          let diff = markets[a.market] < markets[b.market] ? -1 : 1;
          return diff * desc;
        })
      } else if (order == 'manager') {
        etfs.sort((a, b) => {
          let diff = a.manager.toUpperCase() < b.manager.toUpperCase() ? -1 : 1;
          return diff * desc;
        })
      }

      return etfs;
    }
  },
  methods: {
    sort(ord) {
      if (ord == this.order) {
        this.desc = !this.desc;
      } else {
        this.order = ord;
        this.desc = false;
      }
    },
    create() {
      this.$refs.form.open(null);
    },
    update(etf) {
      this.$refs.form.open(etf);
    },
    remove(etf) {
      if (confirm('Подтвердить удаление')) {
        fetch(`${url}/etfs/delete/${etf.id}`, {
          method: 'GET'
        })
          .then((res) => res.json())
          .then((json) => {
            this.etfs = json.etfs;
          });
      }
    },
    onCreate(data) {
      fetch(`${url}/etfs/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((json) => {
          this.etfs = json.etfs;
        });
    },
    onUpdate(data) {
      console.log('update', data);
      fetch(`${url}/etfs/update/${data.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((json) => {
          this.etfs = json.etfs;
        });
    }
  }
};
</script>
