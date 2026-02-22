package com.tight.coupling;

import java.security.PublicKey;

public class TightCouplingExample {
  public static void main(String[] args){
    UserManager userManager= new UserManager();
    System.out.println(userManager.getinfo());
  }

}
