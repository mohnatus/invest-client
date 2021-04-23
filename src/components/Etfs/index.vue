<template>
  <div>
    <div>
      <div class="etf" v-for="etf of etfs" :key="etf.ticker">
        <div class="etf-data">
          <div>{{ etf.ticker }}</div>
        </div>

        <div class="etf-actions">
          <button @click="update(etf)">Изменить</button>
          <button @click="remove(etf)">Удалить</button>
        </div>
      </div>
    </div>

    <div>
      <button @click="create()">Добавить</button>
    </div>

    <div class="form">
      <EtfForm ref="form" @create="onCreate" @update="onUpdate"></EtfForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script>
import { url } from '../../config/api';
import EtfForm from './form.vue';

export default {
  components: { EtfForm },
  data() {
    return {
      etfs: []
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
  methods: {
    create() {
      this.$refs.form.open(null);
    },
    update(etf) {
      this.$refs.form.open(etf);
    },
    remove(etf) {
      fetch(`${url}/etfs/delete/${etf.ticker}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((json) => {
          this.etfs = json.etfs;
        });
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
      fetch(`${url}/etfs/update`, {
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
