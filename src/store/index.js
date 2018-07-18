import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import mutations from './mutations'

export default new Vuex.Store({
	getters:mutations.getters,
	mutations:mutations.mutations,
	state:mutations.state,
	actions:mutations.Actions
})
