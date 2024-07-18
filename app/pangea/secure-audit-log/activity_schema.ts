import { Audit } from "@pangeacyber/react-mui-audit-log-viewer"
import { GridColDef } from "@mui/x-data-grid";

type ServiceEventFields = "status" | "service_name" | "action" | "service_feature" | "message"
export const SERVICE_TO_SERVICE_FIELD_CUSTOMIZATIONS: Partial<Record<ServiceEventFields, Partial<GridColDef>>> =
  {
    status: {
      minWidth: 80,
      width: 80
    },
    service_name: {
      minWidth: 120,
      width: 120
    },
    action: {
      minWidth: 130,
      width: 130
    },
    service_feature: {
      minWidth: 140,
      width: 140
    },
    message: {
        minWidth: 350
    }
};

export const SERVICE_TO_SERVICE_AUDIT_SCHEMA: Audit.Schema = {
  fields: [
    {
      id: "timestamp",
      type: "datetime",
      description: "An optional client-supplied timestamp",
      name: "Timestamp",
      redact: false,
      required: false,
      size: 128,
      ui_default_visible: true,
    },
    {
      id: "service_name",
      name: "Service",
      type: "string",
      size: 128,
      required: true,
      ui_default_visible: true,
      redact: false,
      description: "Service name generating the event. ex: Vault.",
    },
    {
      id: "action",
      name: "Action",
      type: "string",
      size: 128,
      required: true,
      ui_default_visible: true,
      redact: false,
      description: "Service action generating the event.",
    },
    {
      id: "service_feature",
      name: "Service Feature",
      type: "string",
      size: 128,
      required: true,
      ui_default_visible: true,
      redact: false,
      description:
        "Service feature generating the event. ex: key_generate feature in Vault service.",
    },
    {
      id: "status",
      name: "Status",
      type: "string",
      size: 128,
      required: true,
      ui_default_visible: true,
      redact: false,
      description:
        "Status of the event. Success if successful otherwise indicates an error.",
    },
    {
      id: "message",
      name: "Message",
      type: "string",
      size: 32766,
      required: true,
      ui_default_visible: true,
      redact: false,
      description: "Service logging message about the event.",
    },
    {
      id: "source",
      name: "Source",
      type: "string",
      size: 128,
      required: false,
      ui_default_visible: false,
      redact: false,
      description:
        "Source of the event. This is the endpoint url that generated the event. ex: https://vault.aws.pangea.cloud/v1/key/generate",
    },
    {
      id: "new",
      name: "New",
      type: "string",
      size: 32766,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "New value of the field that was modified in the event.",
    },
    {
      id: "old",
      name: "Old",
      type: "string",
      size: 32766,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "Old value of the field that was modified in the event.",
    },
    {
      id: "ip",
      name: "IP",
      type: "string",
      size: 32766,
      required: false,
      ui_default_visible: false,
      redact: false,
      description:
        "Client IP address from which the api request was made that generated the event.",
    },
    {
      id: "request_id",
      name: "Request ID",
      type: "string",
      size: 128,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "Pangea Request ID of the api request.",
    },
    {
      id: "config_id",
      name: "Config ID",
      type: "string",
      size: 128,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "Service Config ID used in the api request.",
    },
    {
      id: "resource_id",
      name: "Resource ID",
      type: "string",
      size: 128,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "Resource ID used in the api request.",
    },
    {
      id: "token_id",
      name: "Token ID",
      type: "string",
      size: 128,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "Token Representation used in the api request.",
    },
    {
      id: "tenant_id",
      name: "Tenant ID",
      type: "string",
      size: 128,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "Tenant ID used in the api request.",
    },
    {
      id: "external_context",
      type: "string",
      name: "External Context",
      size: 32766,
      required: false,
      redact: false,
      description: "Added context beyond the log event.",
    },
    {
      id: "identity",
      name: "Identity",
      type: "string",
      size: 128,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "An identifier for who performed the api request.",
    },
    {
      id: "identity_name",
      name: "Identity Name",
      type: "string",
      size: 32766,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "An identifier name for who performed the api request.",
    },
    {
      id: "target",
      name: "Target",
      type: "string",
      size: 32766,
      required: false,
      ui_default_visible: false,
      redact: false,
      description: "An object identifier for what the audit record is about.",
    },
  ],
}
