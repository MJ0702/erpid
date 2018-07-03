import Vue from 'vue'

const state = {
  contacts: [],
  contact: {},
  contacts_search: [],
}

const getters = {
  contacts: state => {
    return state.contacts
  },
  contact: state => state.contact,
  contacts_search: state => state.contacts_search,
}

const actions = {
  contact_select ({ commit }, contact) {
    commit("change_contact", { contact })
  },
  contacts_search_clear({ commit }) {
    commit("change_contacts_search", { contacts: [] })
  },
  contacts_search ({ commit }, keyword) {
    if(!keyword || keyword.length < 1 || keyword.trim().length < 1) return;
    console.log(keyword);
    Vue.http.post(
      "profile/phone-book",
      {
        // page: 1,
        // start: 0,
        // limit: 50,
        // sort: '[{"property":"ID","direction":"desc"}]',
        skey: keyword,
      },
      {emulateJSON: true}
    ).then(res => {
      let contacts = res.body.rows;
      commit("change_contacts_search", { contacts })
    })
  },
  contacts_request ({ commit }) {
    Vue.http.post(
      "profile/phone-book"
      // "profile/phone-book",
      // {
      //   page: 1,
      //   start: 0,
      //   limit: 50,
      //   sort: '[{"property":"ID","direction":"desc"}]',
      // },
      // {emulateJSON: true}
    ).then(res => {
      if(!res.body) return;
      let rows = res.body.rows;
      let curi = "A"
      let contacts = [];
      for (let i = 0; i < rows.length; i++) {
        let contact = rows[i];
        if(contact.pyName) {
          let rowi = contact.pyName[0];
          if (rowi != curi) {
            curi = rowi;
            contacts.push({
              index: curi,
              items: [contact],
            });
          } else {
            contacts[contacts.length-1].items.push(contact)
          }
        } else {
          break;
        }
      }
      if (contacts.length < 1 && rows.length > 1) {
        let groups = PyGroupSort(function(next, store) {
          rows.forEach((i) => {
            if (next(i.pyName)) store(i)
          })
        });
        for (let key in groups) {
          contacts.push({
            index: key.toUpperCase(),
            items: groups[key],
          });
        }
      }
      commit("change_contacts", { contacts })
    })
  },
  contacts_clear({commit}) {
    commit("change_contacts", { contacts: []})
  }
}

const mutations = {
  change_contact (state, { contact }) {
    state.contact = contact
  },
  change_contacts (state, { contacts }) {
    state.contacts = contacts
  },
  change_contacts_search (state, { contacts }) {
    state.contacts_search = contacts
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
