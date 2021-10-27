Applicable to the following tenancies:
* BBB
* FSG (partially)
* ViaSat (partially)
* VIMLA (partially)

## Get API keys from console
Start by creating a new API key from https://console.wgtwo.com/s/<tenant>/settings/api-keys. Each user should generate their own key. Rights must be to set to at least:
- subscription.read
- subscription.write

Make sure to save the Client ID and Client secret.

List service configuration for a user
`curl -su <Client_ID>:<Client_Secret> https://api.wgtwo.com/subscription/v1/msisdn/xx`

The json output can be parsed with a tool like jq , also allowing to retrieve only a specific service configuration. For example:
`curl -su <Client_ID>:<Client_Secret> https://api.wgtwo.com/subscription/v1/msisdn/xx | jq .services.DATA_CUSTOM_DNS`

`curl -su <Client_ID>:<Client_Secret> https://api.wgtwo.com/subscription/v1/msisdn/xx | jq .services.DATA_STATIC_IP`

## Set a static IP for a user

Restrictions:
* IP must be in the range configured on PGW
* IP must not be the network (.0) or broadcast address (.255)
* Other range can be configured manually
* Only for the main/default internet APN
* There is no check for overlapping IP address.
```
curl \
    -u <Client_ID>:<Client_Secret>  \
    -H 'Content-Type: application/json' \
    -d '
    {
        "bssid": "<tenant>",
          "service": {
            "name": "DATA_STATIC_IP",
            "action": "ADD",
            "configuration": {
                "IPv4": {
                    "ip": "x.x.x.x"
                }
            }
          },
        "msisdn": "xx",
        "userid": "xx"
    }
    ' \
    https://api.wgtwo.com/provision/v1/update
```
## Remove a static IP for a user
```
curl \
    -u <Client_ID>:<Client_Secret>  \
    -H 'Content-Type: application/json' \
    -d '
    {
        "bssid": "<tenant>",
          "service": {
            "name": "DATA_STATIC_IP",
            "action": "REMOVE"
          },
        "msisdn": "811100010000x",
        "userid": "BBB Test x"
    }
    ' \
    https://api.wgtwo.com/provision/v1/update
```
## Set a custom DNS for a user
Restrictions:
* Only for the main/default internet APN
* DNS must be reachable on the Internet
* Both primary and secondary DNS must be set.
```
curl \
    -u <Client_ID>:<Client_Secret>  \
    -H 'Content-Type: application/json' \
    -d '
    {
        "bssid": "<tenant>",
        "service": {
          "name": "DATA_CUSTOM_DNS",
          "action": "ADD",
          "configuration": {
              "IPv4": {
                  "primary": "x.x.x.x",
                  "secondary": "x.x.x.x"
              }
           }
        },
        "msisdn": "xx",
        "userid": "xx"
    }
    ' \
    https://api.wgtwo.com/provision/v1/update
```
## Remove a custom DNS for a user
```
curl \
    -u <Client_ID>:<Client_Secret>  \
    -H 'Content-Type: application/json' \
    -d '
    {
        "bssid": "<tenant>",
          "service": {
            "name": "DATA_CUSTOM_DNS",
            "action": "REMOVE"
          },
        "msisdn": "xx",
        "userid": "xx"
    }
    ' \
    https://api.wgtwo.com/provision/v1/update
``