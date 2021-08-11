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

## The how and why (background)

ASN.1

# Nitty gritty

## Modules

The purpose of an ASN.1 module is to name a collection of types and/or
value definitions.

It consist of a module reference and an optional object identifier
together with the declaration of the `DEFINITIONS` type definition.
Note that even though the object identifier is optional, it is
considered bad practice to leave it out. The reason for it being
optional is for backward compatability; it was not part of the
original ASN.1 specification.
The `DEFINITIONS` keyword usually comes together with the `BEGIN` and
`END` keywords so multiple definitions can be done. (What else is the
point of a module if not to make a collection...).

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

### BOOLEAN

The `BOOLEAN` type takes values `TRUE` or `FALSE`.

```
AudibleIndicator ::= CHOICE {
	tone								BOOLEAN,
	burstList							[1] BurstList
	}

```

### NULL

The `NULL` type is basically a placeholder, where the recognition of a
value is important but the actual value is not.

In 3GPP it is similar to `BOOLEAN` in the sense that a defined `NULL`
value is considered `TRUE` and if the value is missing it is
considered `FALSE`. The reason for this is that it will take no space
when sent over the network if it is `FALSE` and the same amount of
space as `BOOLEAN` if `TRUE`.

```
CancelArg {PARAMETERS-BOUND : bound} ::= CHOICE {
	invokeID							[0] InvokeID,
	allRequests							[1] NULL,
	callSegmentToCancel					[2]	CallSegmentToCancel {bound}
}
```

in this example `allRequests` can be defined (as `NULL`) or not at all.

### INTEGER

`INTEGER` takes any of the infinite set of integer values. It can also
have the additional notation that names some of the values.


```
GSMMAPOperationLocalvalue ::= INTEGER{
	updateLocation (2),
	cancelLocation (3),
	provideRoamingNumber (4),
	noteSubscriberDataModified (5),
	resumeCallHandling (6),
	insertSubscriberData (7),
	-- rest of the named integers --
}
```

```
localvalue1 GSMMAPOperationLocalvalue ::= updateLocation
localvalue2 GSMMAPOperationLocalvalue ::= 2
localvalue3 GSMMAPOperationLocalvalue ::= -55413459
```
are all valid `GSMMAPOperationLocalvalue`s.

### ENUMERATED

`ENUMERATED` has the same interpretation as `INTEGER` but will hold
specific values only.


```
RequestedInformationType ::= ENUMERATED {
    callAttemptElapsedTime(0),
    callStopTime(1),
    callConnectedElapsedTime(2),
    calledAddress(3),
    releaseCause(30)
}
```

```
reqInfoType1 RequestedInformationType ::= callAttemptElapsedTime
reqInfoType2 RequestedInformationType ::= 0
```

are both valid values of `RequestInformationType`, while this is not:

```
notValidReqInfoType RequestedInformationType ::= 4
```

### BIT STRING

`BIT STRING` takes values that are a sequence of zero or more bits. It
can also take an additional notation that name certain bits in the bit
sequence.

```
DeferredLocationEventType ::= BIT STRING {
	msAvailable	(0) ,
	enteringIntoArea	(1),
	leavingFromArea	(2),
	beingInsideArea	(3) ,
	periodicLDR	(4)
} (SIZE (1..16))
```

```
eventType1 DeferredLocationEventType ::= (msAvailable, beingInsideArea)
eventType2 DeferredLocationEventType ::= '10010'B
eventType3 DeferredLocationEventType ::= '12'H
```

are all valid value definitions of the same bit sequence where the
first and third bits are set, and no other bits are set.  The `B` stands
for binary representation and `H` for hexadecimal representation.

### OCTET STRING

Type `OCTET STRING` takes values that are an ordered sequence of zero
or more eight-bit octets.

```
MM-Code ::= OCTET STRING (SIZE (1))
```

In the same manor as `BIT STRING` both values below are valid
instances of `MM-Code`:

```
iMSI-Attach1	MM-Code ::= '00000010'B
iMSI-Attach2	MM-Code ::= '02'H
```

while

```
notValidIMSI-Attach	MM-Code ::= '10010'B
```

is not a valid value due to it not being a multiple of eight bits.

### OBJECT IDENTIFIER

The `OBJECT IDENTIFIER` type (shortened `OID`) names information
objects such as ASN.1 modules. The named information object is a node
on an object identifier tree that is managed at the international
level.

ETSI for instance is managed by ITU-T
`itu-t(0) identified-organization(4) etsi(0)`

<div>
    <img src="/img/blog/the-specs-behind-the-specs/etsi_asn1oidtree.gif" alt="ETSI OID tree" />
</div>

and as can see in the `Modules` example version 8 of cap-datatypes is part of ETSI.
`CAP-datatypes {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0) umts-network(1) modules(3) cap-datatypes(52) version8(7)}`

Other root arcs
| 0 | ITU-T           |
| 1 | ISO             |
| 2 | joint-iso-itu-t |

The labels are optional and the reference could also be written as `{0
4 0 0 1 3 52 7}`. Only positive integers are allowed including zero (0).

Another example comes from the CAP-object-identifiers module in ETSI 129.078.
```
tc-Messages	OBJECT IDENTIFIER ::=
	{itu-t recommendation q 773 modules(2) messages(1) version3(3)}

id-CAP	OBJECT IDENTIFIER ::=
	{itu-t(0) identified-organization(4) etsi(0) mobileDomain(0)
	umts-network(1) cap4(22)}

id-ac	OBJECT IDENTIFIER ::= {id-CAP ac(3)}
```

`id-ac` is a child of the `id-CAP` object identifier.

### EXTERNAL
### REAL
### UTF8String
### TIME
### NumericString
### IA5String
### UTCTime
### GeneralizedTime
### VisibleString
### DATE
### TIME-OF-DAY
### DATE-TIME
### DURATION


### SEQUENCE (OF)
### SET (OF)
### CHOICE
### SELECTION

## Classes

<!-- # Diameter dictionary files -->

<!-- <div> -->
<!--     <img src="/img/blog/sms/forward-sm.svg" alt="You calling your mom" /> -->
<!-- </div> -->
