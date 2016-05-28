
// An hyperx "transform" is kinda like a middleware
//
// The function is executed with hyperx arguments, which are modified along the
// way.
//
// Synchronous process for the moment
module.exports = (tag, attrs, children) => {
  // console.log('hpx >> tag', tag);
  // console.log('hpx >> attrs', attrs);
  // console.log('hpx >> children', children);

  return {
    tag,
    attrs,
    children
  };
};
