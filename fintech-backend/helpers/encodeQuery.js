"use strict";

/**
 * Format url
 */
exports.encodeQuery = (data) => {
  let query = data.url;
  for (let d in data.params)
    query +=
      encodeURIComponent(d) + "=" + encodeURIComponent(data.params[d]) + "&";
  return query.slice(0, -1);
};
