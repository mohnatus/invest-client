<template>
  <div class="modal" v-if="opened">
    <div class="modal-mask" @click="close"></div>
    <div class="modal-content">
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
              <label class="form-label" for="etf-description">Ссылка </label>
              <input type="text" v-model="link" />
            </div>
          </div>
          <div class="col col-manager">
            <div class="form-group">
              <label class="form-label" for="etf-manager"
                >Управляющая компания</label
              >
              <input type="text" v-model="manager" />
            </div>
            <div>
              <button @click="manager='Альфа-капитал'" type="button">Альфа-капитал</button>
              <br>
              <button @click="manager='ВТБ'" type="button">ВТБ</button>
              <br>
              <button @click="manager='Сбер'" type="button">Сбер</button>
              <br>
              <button @click="manager='Тинькофф'" type="button">Тинькофф</button>
              <br>
              <button @click="manager='FinEx'" type="button">FinEx</button>
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
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  form {
    width: 100%;
    max-width: 600px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    pointer-events: auto;
  }
}
</style>

<script>
export default {
  data() {
    return {
      id: null,
      mode: 'create',
      opened: false,
      ticker: '',
      name: '',
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

  methods: {
    reset() {
      this.id = null;
      this.ticker = '';
      this.name = '';
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
        this.description = data.description;
        this.currency = data.currency;
        this.manager = data.manager;
        this.type = data.type;
        this.market = data.market;
        this.link = data.link;
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
