const Showcase = require('./showcase');
const Elem = require('../../src/main');

let run = true;

Showcase.registerTile('Performance example', container => {
  run = true;
  let DBMon = Elem.component({
    init() {
      this.loadSamples();
    },
    getInitialState() {
      return {
        databases: []
      };
    },
    loadSamples() {
      if (!run) return;
      let db = window.ENV.generateData().toArray();
      this.setState({ databases: db });
      window.Monitoring.renderRate.ping();
      setTimeout(this.loadSamples, window.ENV.timeout);
    },
    render() {
      let rows = this.state.databases.map(database => {
        let base = [
          Elem.el('td', {className: 'dbname'}, [database.dbname]),
          Elem.el('td', { className: 'query-count' }, [
            Elem.el('span', { className: database.lastSample.countClassName }, [database.lastSample.queries.length])
          ])
        ];
        base = base.concat(
          database.lastSample.topFiveQueries.map(query => {
            return Elem.el('td', { className: 'Query ' + query.elapsedClassName }, [
              Elem.el('span', {}, [query.formatElapsed]),
              Elem.el('div', { className: 'popover left' }, [
                Elem.el('div', { className: 'popover-content' }, [query.query]),
                Elem.el('div', { className: 'arrow' }, [''])
              ])
            ]);
          })
        );
        return Elem.el('tr', {key: database.dbname}, base);
      });
      let finalElem = Elem.el('div', [
        Elem.el('div', { id: 'theSlider' }, ''),
        Elem.el('table', { className: 'table table-striped latest-data' }, [
          Elem.el('tbody', rows)
        ])
      ]);
      return finalElem;
    }
  });
  DBMon().renderTo(container);
  let body = document.querySelector('#theSlider');
  window.ENV.injectSlider(body);
}, () => {
  run = false;
});
