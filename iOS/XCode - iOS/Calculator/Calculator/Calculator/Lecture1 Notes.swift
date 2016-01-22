////
////  ViewController.swift
////  Calculator
////
////  Created by Kyle King on 12/27/15.
////  Copyright © 2015 Kyle King. All rights reserved.
////
//
//import UIKit
//
////Useful shortcuts
////Ctrl + drag -> set constraints for UI or add method/pointer to code
////opt -> get info and look up documentation
//
//class ViewController: UIViewController {
//    
//    //    override func viewDidLoad() {
//    //        super.viewDidLoad()
//    //        // Do any additional setup after loading the view, typically from a nib.
//    //    }
//    //
//    //    override func didReceiveMemoryWarning() {
//    //        super.didReceiveMemoryWarning()
//    //        // Dispose of any resources that can be recreated.
//    //    }
//    
//    //    Instance variable -> each instance has its own copy (Called property in Swift)
//    //    Always a ponter because object lives in heap + no need for clearing heap, etc
//    //    Not covering "weak", "!", etc.
//    //                  var name type
//    
//    var UserIsTypingNumber: Bool = false
//    
//    @IBOutlet weak var Display: UILabel!
//    @IBAction func appendDigit(sender: UIButton) {
//        //        Let is a variable, but is a constant
//        let digit = sender.currentTitle!
//        //        print("digit = \(digit)")
//        //        Need type in digit because outputs Optional("#") by inference/default
//        //        - Optional is a type that can be not set (nil) or something, with type String?
//        //        i.e. and optional that can be a string
//        //        If currentvalue is not set, "!" will cause program to crash, but the "!" is useful in unwrapping the Optional type
//        if UserIsTypingNumber {
//            Display.text = Display.text! + digit
//        } else {
//            Display.text = digit
//            UserIsTypingNumber = true
//        }
//        
//    }
//}
//
