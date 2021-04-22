<template>
  <table>
    <tbody>
      <tr>
        <th>Глобальный<br />рынок</th>
        <td>
          <input type="number" v-model="groups.global" />
        </td>
        <td>
          <div class="tickers-list">
            <Ticker
              v-for="etf in items.global.filter((i) => i.active)"
              :key="etf.ticker"
              :etf="etf"
            >
              {{ etf.ticker }}
            </Ticker>
            <Ticker
              v-for="etf in items.global.filter((i) => !i.active)"
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
          <input type="number" v-model="groups.usa" />
        </td>
        <td>
          <div class="tickers-list">
            <Ticker
              v-for="etf in items.usa.filter((i) => i.active)"
              :key="etf.ticker"
              :etf="etf"
            >
              {{ etf.ticker }}
            </Ticker>
            <Ticker
              v-for="etf in items.usa.filter((i) => !i.active)"
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
          <input type="number" v-model="groups.russia" />
        </td>
        <td>
          <div class="tickers-list">
            <Ticker
              v-for="etf in items.russia.filter((i) => i.active)"
              :key="etf.ticker"
              :etf="etf"
            >
              {{ etf.ticker }}
            </Ticker>
            <Ticker
              v-for="etf in items.russia.filter((i) => !i.active)"
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
          <input type="number" v-model="groups.developed" />
        </td>
        <td>
          <div class="tickers-list">
            <Ticker
              v-for="etf in items.developed.filter((i) => i.active)"
              :key="etf.ticker"
              :etf="etf"
            >
              {{ etf.ticker }}
            </Ticker>
            <Ticker
              v-for="etf in items.developed.filter((i) => !i.active)"
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
          <input type="number" v-model="groups.emerging" />
        </td>
        <td>
          <div class="tickers-list">
            <Ticker
              v-for="etf in items.emerging.filter((i) => i.active)"
              :key="etf.ticker"
              :etf="etf"
            >
              {{ etf.ticker }}
            </Ticker>
            <Ticker
              v-for="etf in items.emerging.filter((i) => !i.active)"
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
          {{ sum }}
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Ticker from './ticker.vue';
export default {
  props: ['groups', 'items'],
  components: { Ticker },
  computed: {
    sum() {
      return Object.values(this.groups).reduce(
        (acc, v) => acc + parseInt(v),
        0
      );
    }
  }
};
</script>
