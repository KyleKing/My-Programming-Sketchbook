//
//  ViewController.swift
//  Calculator
//
//  Created by Kyle King on 12/27/15.
//  Copyright © 2015 Kyle King. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    var UserIsTypingNumber = false

    // Optionals are inherently = nil, but better to unwrap early to save typing elsewhere
    @IBOutlet weak var Display: UILabel!

    
    @IBAction func appendDigit(sender: UIButton) {
        let digit = sender.currentTitle!
        if UserIsTypingNumber {
            Display.text = Display.text! + digit
        } else {
            Display.text = digit
            UserIsTypingNumber = true
        }
    }
    
    //    var operandStack: Array<Double> = Array<Double>()
    //    If can be infered, don't do extra work and introduce errors
    var operandStack = Array<Double>()
    @IBAction func Enter() {
        UserIsTypingNumber = false
        operandStack.append(displayValue)
        print("operandStack = \(operandStack)")
    }
    //    Create reactive value based on display and output in Double format
    var displayValue: Double {
        get {
            return NSNumberFormatter().numberFromString(Display.text!)!.doubleValue
        }
        set {
            Display.text = "\(newValue)"
            UserIsTypingNumber = false
        }
    }
    
    
    ////  1. Messy way:
    //    func multiply(op1: Double, op2: Double) -> Double {
    //        return op1 * op2
    //    }
    
    @IBAction func operate(sender: UIButton) {
        let operation = sender.currentTitle!
        if UserIsTypingNumber {
            Enter()
        }
        switch operation {
////        2. Cleaner way... "closure":
//          case "×": performOperation({ (op1: Double, op2: Double) -> Double in
//              return op1 * op2
//          })
////        3. Cleanest
//          case "×": performOperation({ (op1, op2) in op1 * op2 })
//          4. The best -> defaults to $0, $1, etc.
            case "×": performOperation { $0 * $1 }
//            Check order
            case "÷": performOperation { $1 / $0 }
            case "+": performOperation { $1 + $0 }
            case "-": performOperation { $1 - $0 }
            case "-": performOperation { $1 - $0 }
            case "√": performSingleOperation { sqrt($0) }
            default: break
        }
    }
    
    
    func performOperation(operation: (Double,Double) -> Double) {
        if operandStack.count >= 2 {
            displayValue = operation(operandStack.removeLast(), operandStack.removeLast())
            Enter()
        }
    }
    
    func performSingleOperation(operation: Double -> Double) {
        if operandStack.count == 1 {
            displayValue = operation(operandStack.removeLast())
            Enter()
        }
    }
    
//    Model - What application is, but not UI
//    Controller - How model is presented [Specific to use case]
//    View - "Controller's minions" [Generic]
//    See screenshot for layout and directions of communications
//        No model <-x-> view
//        Controller -> view (is outlet)
//        Controller -> Model (also allowed)
//    View -> Controller Protocols
//      - Controller is data source, not Model
//      Structured: Target-action (Controller has target, view creates action)
//      Delegate: "Should, will, did, etc." [Blind communication]
//    model -> controller ("Radio communication")
//    
//    Oh and MVC inception by recursively stacking them inside eachother
}

