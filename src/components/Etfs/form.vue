<template>
  <div class="modal" v-if="opened">
    <div class="modal-mask" @click="close"></div>
    <div class="modal-content">
      <button class="modal-close" type="button" @click="close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
          />
        </svg>
      </button>

      <form v-on:submit.prevent="onSubmit">
        <div class="row">
          <div class="col col-ticker">
            <div class="form-group">
              <label class="form-label" for="etf-ticker">Тикер</label>
              <input type="text" v-model="ticker" ref="input" />
            </div>
          </div>
          <div class="col col-name">
            <div class="form-group">
              <label class="form-label" for="etf-name">Название фонда</label>
              <input type="text" v-model="name" />
            </div>
          </div>
          <div class="col col-group">
            <div class="form-group">
              <label class="form-label" for="etf-group">Теги</label>

              <div>
                <div class="tag-group" v-for="t in tagsBoxes" :key="t">
                  <input type="checkbox" name="tags[]" v-model="tags" :value="t" :id="'tag-' + t">
                  <label :for="'tag-' +  t">{{ t }}</label>
                </div>
                <div class="tag-group">
                  <input type="text" @keydown.enter.prevent="addTag($event)">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col col-description">
            <div class="form-group">
              <label class="form-label" for="etf-description"
                >Описание фонда</label
              >
              <textarea v-model="description" rows="5"></textarea>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col col-currency">
            <div class="form-group">
              <label class="form-label">Валюта</label>
              <div class="radio-group">
                <input
                  type="radio"
                  value="rub"
                  id="etf-currency-rub"
                  v-model="currency"
                />
                <label for="etf-currency-rub">RUB</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="usd"
                  id="etf-currency-usd"
                  v-model="currency"
                />
                <label for="etf-currency-usd">USD</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="eur"
                  id="etf-currency-eur"
                  v-model="currency"
                />
                <label for="etf-currency-eur">EUR</label>
              </div>
            </div>
          </div>

          <div class="col col-market">
            <div class="form-group">
              <label class="form-label">Рынок</label>
              <div class="radio-group">
                <input
                  type="radio"
                  value="global"
                  id="etf-market-global"
                  v-model="market"
                />
                <label for="etf-market-global">Глобальный</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="usa"
                  id="etf-market-usa"
                  v-model="market"
                />
                <label for="etf-market-usa">США</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="russia"
                  id="etf-market-russia"
                  v-model="market"
                />
                <label for="etf-market-russia">Россия</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="developed"
                  id="etf-market-developed"
                  v-model="market"
                />
                <label for="etf-market-developed">Развитые</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="emerging"
                  id="etf-market-emerging"
                  v-model="market"
                />
                <label for="etf-market-emerging">Развивающиеся</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="gold"
                  id="etf-market-gold"
                  v-model="market"
                />
                <label for="etf-market-gold">Драг. металлы</label>
              </div>
            </div>
          </div>

          <div class="col col-active">
            <div class="form-group">
              <label class="form-label">Тип активов</label>
              <div class="radio-group">
                <input
                  type="radio"
                  value="stocks"
                  id="etf-type-stocks"
                  v-model="type"
                />
                <label for="etf-type-stocks">Акции</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="bonds"
                  id="etf-type-bonds"
                  v-model="type"
                />
                <label for="etf-type-bonds">Облигации</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="mixed"
                  id="etf-type-mixed"
                  v-model="type"
                />
                <label for="etf-type-mixed">Смешанный</label>
              </div>
              <div class="radio-group">
                <input
                  type="radio"
                  value="gold"
                  id="etf-type-gold"
                  v-model="type"
                />
                <label for="etf-type-gold">Драг. металлы</label>
              </div>
            </div>
          </div>
          <div class="col col-actives">
            <div class="form-group" v-if="type == 'mixed'">
              <label class="form-label">Состав фонда</label>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>Акции</td>
                      <td>
                        <input type="number" v-model="actives.stocks" />
                      </td>
                    </tr>
                    <tr>
                      <td>Облигации</td>
                      <td>
                        <input type="number" v-model="actives.bonds" />
                      </td>
                    </tr>
                    <tr>
                      <td>Драг. металлы</td>
                      <td>
                        <input type="number" v-model="actives.gold" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col col-link">
            <div class="form-group">
              <label class="form-label" for="etf-link">Ссылка</label>
              <input type="text" id="etf-link" v-model="link" />
            </div>
          </div>
          <div class="col col-manager">
            <div class="form-group">
              <label class="form-label" for="etf-manager"
                >Управляющая компания</label
              >
              <input type="text" v-model="manager" />
            </div>
            <div class="list">
              <button
                type="button"
                v-for="m of managers"
                :key="m"
                @click="manager = m"
              >
                {{ m }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button type="submit">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  margin-left: -10px;
  margin-right: -10px;
}
.col {
  flex-grow: 1;
  padding-left: 10px;
  padding-right: 10px;

  &-ticker {
    max-width: 100px;
  }

  &-currency {
    width: 90px;
  }

  &-market,
  &-active,
  &-actives {
    width: 100%;
  }
}
.form-group {
  margin-bottom: 16px;
}
.form-label {
  margin-bottom: 6px;
  font-weight: 700;
}
.radio-group {
  display: flex;
  align-items: center;

  input {
    margin-right: 12px;
  }
}
input[type='text'],
textarea {
  display: block;
  width: 100%;
}
input[type='text'] {
  height: 38px;
}
table {
  input {
    width: 50px;
  }
}
textarea {
  resize: vertical;
  min-height: 70px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
  &-content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  &-close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  form {
    width: 100%;
    height: 100%;
    padding: 40px;
    background: white;
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  button {
    margin: 5px;
  }
}
</style>

<script>

export default {
  props: ['managers', 'tagsList'],
  data() {
    return {
      id: null,
      mode: 'create',
      opened: false,
      ticker: '',
      name: '',
      tags: [],
      description: '',
      currency: '',
      manager: '',
      link: '',
      type: '',
      actives: {
        stocks: 0,
        bonds: 0,
        gold: 0
      },
      market: ''
    };
  },

  watch: {

    opened(value) {
      document.body.style.overflow = value ? 'hidden' : '';
    }
  },

  computed: {
   tagsBoxes() {
      let tags = new Set([
        ...this.tags,
        ...this.tagsList
      ]);
      return [...tags];
    },
  },

  methods: {
    addTag(event) {
      let tag = event.target.value;
      event.target.value = '';
      this.tags.push(tag);
    },
    reset() {
      this.id = null;
      this.ticker = '';
      this.name = '';
      this.tags = [];
      this.description = '';
      this.currency = '';
      this.manager = '';
      this.type = '';
      this.market = '';
      this.link = '';
      this.actives.stocks = 0;
      this.actives.bonds = 0;
      this.actives.gold = 0;
    },
    onSubmit() {
      let data = {
        id: this.id,
        ticker: this.ticker.toUpperCase(),
        name: this.name,
        tags: this.tags,
        description: this.description,
        currency: this.currency,
        manager: this.manager,
        type: this.type,
        market: this.market,
        link: this.link
      };

      if (this.type == 'stocks') {
        data.actives = { stocks: 100 };
      } else if (this.type == 'bonds') {
        data.actives = { bonds: 100 };
      } else if (this.type == 'gold') {
        data.actives = { gold: 100 };
      } else {
        data.actives = this.actives;
      }

      this.$emit(this.mode, data);
      this.opened = false;

      this.reset();
    },
    open(data) {
      if (data) {
        this.id = data.id;
        this.mode = 'update';
        this.ticker = data.ticker;
        this.name = data.name;
        this.tags = data.tags || [];
        this.description = data.description;
        this.currency = data.currency;
        this.manager = data.manager;
        this.type = data.type;
        this.market = data.market;
        this.link = data.link;
        this.actives = data.actives;
      } else {
        this.mode = 'create';
      }
      this.opened = true;
      setTimeout(() => {
        this.$refs.input.focus();
      }, 100);
    },
    close() {
      this.opened = false;

      this.reset();
    }
  }
};
</script>
