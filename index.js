const core = require("@actions/core");
const axios = require("axios");

const getOpts = () => ({
  did: core.getInput("did"),
  tokenEndpoint: core.getInput("tokenEndpoint"),
  tokenAudience: core.getInput("tokenAudience"),
  apiBaseUrl: core.getInput("apiBaseUrl"),
  clientId: core.getInput("clientId"),
  clientSecret: core.getInput("clientSecret"),
});

const getAccessToken = async (application) => {
  const { tokenEndpoint, tokenAudience, clientId, clientSecret } = application;
  const res = await axios({
    method: "post",
    url: tokenEndpoint,
    data: {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      audience: tokenAudience,
    },
  });
  const { access_token } = res.data;
  return access_token;
};

const isoStringNoMS = (date) => date.toISOString().split(".")[0] + "Z";

const issueCredential = async (credential, application) => {
  const token = await getAccessToken(application);
  const { apiBaseUrl } = application;
  const url = apiBaseUrl + "/credentials/issue";
  try {
    const res = await axios.post(
      url,
      {
        credential,
        options: {
          type: "Ed25519Signature2018",
          created: isoStringNoMS(new Date()),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

async function run() {
  try {
    const opts = getOpts();
    console.log(opts);
    const credential = {
      "@context": "https://www.w3.org/2018/credentials/v1",
      type: ["VerifiableCredential"],
      issuer: opts.did,
      issuanceDate: isoStringNoMS(new Date()),
      credentialSubject: {
        id: "did:example:456",
      },
    };
    const application = {
      tokenEndpoint: opts.tokenEndpoint,
      tokenAudience: opts.tokenAudience,
      apiBaseUrl: opts.apiBaseUrl,
      clientId: opts.clientId,
      clientSecret: opts.clientSecret,
    };
    const response = await issueCredential(credential, application);
    core.setOutput("json", JSON.stringify(response));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
