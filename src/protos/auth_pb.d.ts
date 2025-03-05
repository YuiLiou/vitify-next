// package: go.auth.v1
// file: auth.proto

import * as jspb from 'google-protobuf'

export class LoginRequest extends jspb.Message {
  getAccount(): string
  setAccount(value: string): void

  getPassword(): string
  setPassword(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LoginRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: LoginRequest,
  ): LoginRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>
  }
  static serializeBinaryToWriter(
    message: LoginRequest,
    writer: jspb.BinaryWriter,
  ): void
  static deserializeBinary(bytes: Uint8Array): LoginRequest
  static deserializeBinaryFromReader(
    message: LoginRequest,
    reader: jspb.BinaryReader,
  ): LoginRequest
}

export namespace LoginRequest {
  export type AsObject = {
    account: string
    password: string
  }
}

export class LoginResponse extends jspb.Message {
  hasId(): boolean
  clearId(): void
  getId(): number
  setId(value: number): void

  getAccount(): string
  setAccount(value: string): void

  hasLdap(): boolean
  clearLdap(): void
  getLdap(): LoginResponse.Ldap | undefined
  setLdap(value?: LoginResponse.Ldap): void

  clearRolesList(): void
  getRolesList(): Array<string>
  setRolesList(value: Array<string>): void
  addRoles(value: string, index?: number): string

  getToken(): string
  setToken(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LoginResponse.AsObject
  static toObject(
    includeInstance: boolean,
    msg: LoginResponse,
  ): LoginResponse.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>
  }
  static serializeBinaryToWriter(
    message: LoginResponse,
    writer: jspb.BinaryWriter,
  ): void
  static deserializeBinary(bytes: Uint8Array): LoginResponse
  static deserializeBinaryFromReader(
    message: LoginResponse,
    reader: jspb.BinaryReader,
  ): LoginResponse
}

export namespace LoginResponse {
  export type AsObject = {
    id: number
    account: string
    ldap?: LoginResponse.Ldap.AsObject
    rolesList: Array<string>
    token: string
  }

  export class Ldap extends jspb.Message {
    getEmployeeId(): string
    setEmployeeId(value: string): void

    getName(): string
    setName(value: string): void

    getEmail(): string
    setEmail(value: string): void

    getTitle(): string
    setTitle(value: string): void

    getDepartment(): string
    setDepartment(value: string): void

    serializeBinary(): Uint8Array
    toObject(includeInstance?: boolean): Ldap.AsObject
    static toObject(includeInstance: boolean, msg: Ldap): Ldap.AsObject
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
    static extensionsBinary: {
      [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>
    }
    static serializeBinaryToWriter(
      message: Ldap,
      writer: jspb.BinaryWriter,
    ): void
    static deserializeBinary(bytes: Uint8Array): Ldap
    static deserializeBinaryFromReader(
      message: Ldap,
      reader: jspb.BinaryReader,
    ): Ldap
  }

  export namespace Ldap {
    export type AsObject = {
      employeeId: string
      name: string
      email: string
      title: string
      department: string
    }
  }
}
