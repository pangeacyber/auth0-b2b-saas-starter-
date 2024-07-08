registerAuditLogViewer({
  props: {
    onSearch: async function (req) {
      const resp = await fetch("/api/pangea/audit", {
        method: "POST",
        body: JSON.stringify({
          path: "/v1/search",
          ...req,
        }),
      })
      const { result } = await resp.json()
      return result
    },
    onPageChange: async function () {
      const resp = await fetch("/api/pangea/audit", {
        method: "POST",
        body: JSON.stringify({
          path: "/v1/results",
          ...req,
        }),
      })
      const { result } = await resp.json()
      return result
    },
  },
  brandingProps: {
    brandingId: "pro_ehxlzaqyogirqzd3q4jpyqri735krbyv",
    auth: {
      clientToken: "pcl_asw5tdi52l4y6znwrynflad6wtbg7cpj",
      domain: "aws.us.pangea.cloud",
    },
  },
})

function storeProxyFetch(path) {
  return async function(req) {
    const resp = await fetch(`/api/pangea/share`, {
      method: "POST",
      body: JSON.stringify({path: path, ...req}),
      cache: "no-cache",
      credentials: "same-origin",
    })

    if (resp.status > 299 || resp.status < 200) {
      const text = await resp.text()
      console.error(`Error: ${text}; while performing ${path}`)
      throw resp
    }

    const json = await resp.json()
    return json
  }
}

async function upload(
  data,
  contentType,
) {
  // /v1/put
  const resp = await fetch(`/api/pangea/share/upload`, {
    method: "POST",
    body: data,
    cache: "no-cache",
    credentials: "same-origin",
  });
  return await resp.json();
}


const storeCallbackHandler = {
  get: storeProxyFetch("/v1beta/get"),
  list: storeProxyFetch("/v1beta/list"),
  share: {
    list: storeProxyFetch("/v1beta/share/link/list"),
    get: storeProxyFetch("/v1beta/share/link/get"),
    delete: storeProxyFetch("/v1beta/share/link/delete"),
    create: storeProxyFetch("/v1beta/share/link/create"),
    send: storeProxyFetch("/v1beta/share/link/send"),
  },
  delete: storeProxyFetch("/v1beta/delete"),
  update: storeProxyFetch("/v1beta/update"),
  upload: upload,
  folderCreate: storeProxyFetch("/v1beta/folder/create"),
}

registerStoreFileViewer({
  props: {
    apiRef: () => storeCallbackHandler,
  },
  brandingProps: {
    brandingId: "pro_ehxlzaqyogirqzd3q4jpyqri735krbyv",
    auth: {
      clientToken: "pcl_asw5tdi52l4y6znwrynflad6wtbg7cpj",
      domain: "aws.us.pangea.cloud",
    },
  },
})
