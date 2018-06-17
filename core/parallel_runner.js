module.exports = fns => Promise.all( fns.map( fn => fn() ) );
