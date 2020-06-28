import pathify from 'vuex-pathify';

pathify.options.mapping = 'standard'; // Map states to store members using the "standard" scheme
pathify.options.strict = true;        // Throw an error if the store member cannot be found
pathify.options.cache = true;         // Cache generated functions for faster re-use
pathify.options.deep = 1;             // Allow sub-property access to Vuex stores

export default pathify;
