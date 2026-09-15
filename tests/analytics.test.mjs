import assert from "node:assert/strict";
import test from "node:test";
import { analyticsItems, publicPath, purchaseDetails, trackCommerce, trackDiagnostic } from "../src/app/lib/analytics.mjs";

test("analytics serializes only public item identity, never full product records", () => {
  assert.deepEqual(analyticsItems([{_id:"abc123",title:"Tycoon",s3Key:"private",seller:{email:"private@example.test"},downloadUrl:"https://secret"}]), [{item_id:"abc123",item_name:"Tycoon",quantity:1}]);
});
test("page tracking excludes private routes and query strings", () => {
  assert.equal(publicPath("/admin/orders"), null);
  assert.equal(publicPath("/auth/login?email=secret"), null);
  assert.equal(publicPath("/marketplace?search=secret#section"), "/marketplace");
});
test("sandbox or unconfirmed payments cannot become purchases", () => {
  const payment={transaction_id:"txn_abc123"};
  const products=[{_id:"abc123",title:"Map"}];
  assert.equal(purchaseDetails(payment,products,{environment:"sandbox",confirmed:true}),null);
  assert.equal(purchaseDetails(payment,products,{environment:"production",confirmed:false}),null);
  assert.equal(purchaseDetails({},products,{environment:"production",confirmed:true}),null);
  assert.deepEqual(purchaseDetails(payment,products,{environment:"production",confirmed:true}),{transaction_id:"txn_abc123",items:[{item_id:"abc123",item_name:"Map",quantity:1}]});
});
test("tracking is inert without an analytics account or browser", () => {
  assert.equal(trackCommerce("add_to_cart",[{_id:"abc123"}]),false);
  assert.equal(trackCommerce("invented_event",[{_id:"abc123"}]),false);
  assert.equal(trackDiagnostic("download_failure",{reason:"network"}),false);
});
