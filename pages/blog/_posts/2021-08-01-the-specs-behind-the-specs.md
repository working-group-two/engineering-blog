---
layout: blogpost
permalink: /the-specs-behind-the-specs-part-1
title: The specs behind the specs part 1
date: 2021-08-01
tags: telco ASN.1 dia
author: <a href="https://www.linkedin.com/in/sebastian-weddmark-olsson/">Sebastian Weddmark Olsson</a>, Telco newb
---


This will be a two piece blog post. I'll start with ASN.1 and then go
over to Diameter dictionary files.

# Abstract Syntax Notation version One

## Background

ASN.1

# Nitty gritty

## Modules

The purpose of an ASN.1 module is to name a collection of types and/or
value definitions.

It consist of a module reference and an optional object identifier
together with the declaration of the `DEFINITIONS` type definition.
This keyword usually comes with `BEGIN` and `END` keywords so multiple
definitions can be done. (What else is the point of a module if not to
make a collection...).

The Erlang ASN.1 compiler requires each module to be in a separate
file, but generally one ASN.1 file could contain many modules.
Usual file endings are `.asn` and `.asn1`

One example of one file many modules exist in the CAP specification
[ETSI 129.078](https://www.etsi.org/deliver/etsi_ts/129000_129099/129078/16.00.00_60/)


The ASN.1 template for a module
```
ModuleReference ObjectIdentifier
DEFINITIONS ::= BEGIN

END
```

Importing types, values and other structures from other modules can be
done with the `IMPORTS` and `FROM` keywords in the beginning of the
module body.  The `IMPORTS` keyword ends with a single semicolon `;`,
and the different imported definitions are comma-separated.

The meaning of the optional `IMPLICIT TAGS` keywords I'll handle later in this post.

```
CAP-datatypes {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0) umts-network(1) modules(3) cap-datatypes(52) version8(7)}
DEFINITIONS IMPLICIT TAGS ::= BEGIN

IMPORTS

	Duration,
	Integer4,
	Interval,
	LegID,
	ServiceKey
FROM CS1-DataTypes {itu-t(0) identified-organization(4) etsi(0) inDomain(1) in-network(1)
modules(0) cs1-datatypes(2) version1(0)}

	BothwayThroughConnectionInd,
	CriticalityType,
	MiscCallInfo
FROM CS2-datatypes {itu-t(0) identified-organization(4) etsi(0) inDomain(1) in-network(1)
cs2(20) modules(0) in-cs2-datatypes(0) version1(0)}

-- ...more imports...
; -- IMPORTS end here

END -- CAP-datatypes ends here --

-- CAP-errortypes module starts here --
CAP-errortypes {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0) umts-network(1) modules(3) cap-errortypes(51) version8(7)}
DEFINITIONS IMPLICIT TAGS ::= BEGIN


END -- CAP-errortypes ends here --
```

The type definitions `Duration` and `LegID` above are imported from
`CS1-DataTypes` module, while `MiscCallInfo` comes from
`CS2-datatypes`.

### Comments

As can be seen in the above example one can enter comments into the
ASN.1.  Comments starts with double dash `--` and ends with either a
newline or another `--`, whichever comes first.

## Assignments

Type references must start with an uppercase letter and may not end
with a dash `-`. It must also only contain upper- and lower-case
letters, digits or dashes `-`.
The syntax for a type assignment is

```
TypeRef ::= TypeDefinition
```

For instance
```
InvokeIdType ::= INTEGER (-128..127)

CancelArg ::= CHOICE {
    invokeID        [0] InvokeID,
    allRequests     [1] NULL
}

Duration ::= INTEGER (-2..86400)

Integer4 ::= INTEGER (0..2147483647)

Interval ::= INTEGER (-1..60000)

InvokeID ::= InvokeIdType

LegID ::= CHOICE {
    sendingSideID   [0] LegType,
    -- used in operations sent from SCF to SSF
    receivingSideID [1] LegType
    -- used in operations sent from SSF to SCF
}

LegType ::= OCTET STRING (SIZE(1))

ServiceKey ::= Integer4
```

Value references have a similar syntax as type references except that
value references must start with a lower-case letter, and also carry
the values type.

Syntax
```
valueRef Type ::= value
```

For example
```
leg1 LegType ::= '01'H
leg2 LegType ::= '02'H

highLayerCompatibilityLength            INTEGER ::= 2
minAChBillingChargingLength             INTEGER ::= 0
```

## Types

There are some common types, each consists of a type reference and a tag number.
The tag number is used to identify it when sending the type in the network.
The universal tags are specified in [ITU-T X.680](https://www.itu.int/rec/T-REC-X.680/en)

Here is a list of the most common types

| Type              | Universal Tag Number |
|-------------------|----------------------|
| BOOLEAN           | 1                    |
| INTEGER           | 2                    |
| BIT STRING        | 3                    |
| OCTET STRING      | 4                    |
| NULL              | 5                    |
| OBJECT IDENTIFIER | 6                    |
| EXTERNAL          | 8                    |
| REAL              | 9                    |
| ENUMERATED        | 10                   |
| UTF8String        | 12                   |
| TIME              | 14                   |
| SEQUENCE (OF)     | 16                   |
| SET (OF)          | 17                   |
| NumericString     | 18                   |
| IA5String         | 22                   |
| UTCTime           | 23                   |
| GeneralizedTime   | 24                   |
| VisibleString     | 26                   |
| DATE              | 31                   |
| TIME-OF-DAY       | 32                   |
| DATE-TIME         | 33                   |
| DURATION          | 34                   |
|                   |                      |
| CHOICE            | *                    |
| SELECTION         | *                    |


The common types can be divided into simple and structured types.
Structured types are the composition of multiple types (component
types) using one of the following types and keywords `SEQUENCE`,
`SEQUENCE OF`, `SET`, `SET OF`, `CHOICE`, and/or `SELECTION`.  Note
that `CHOICE` and `SELECTION` does not [need to] have their own
universal tags, due to those consisting of only other types.


<div>
    <img src="/img/blog/sms/forward-sm.svg" alt="You calling your mom" />
</div>

<!-- # Diameter dictionary files -->

<!-- <div> -->
<!--     <img src="/img/blog/sms/forward-sm.svg" alt="You calling your mom" /> -->
<!-- </div> -->

