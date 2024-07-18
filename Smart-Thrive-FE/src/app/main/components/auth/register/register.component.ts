import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginUser, RegisterUser } from '../../../../data/model/auth';
import { User } from '../../../../data/entities/user';
import { UserService } from '../../../services/services/user.service';
import { ItemResponse } from '../../../../data/model/base-response';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {

  user: User = {} as User;
  gender!: string;
  dob!: Date;
  confirmPassword!: string;

  constructor(public userService: UserService, private router: Router, private messageService: MessageService) { }
  ngOnInit(): void {
    this.user.gender = 'Female'
  }

  loading = [false, false, false, false];

  load(index: number) {
    this.loading[index] = true;
    this.registerLabel = "";
  }

  clearLoading(index: number) {
    setTimeout(() => { this.loading[index] = false; this.registerLabel = "Register"; }, 1000);
  }

  registerLabel: string = "Register";

  itemResponse: ItemResponse<User> = {} as ItemResponse<User>;

  onRegister(index: number) {
    this.load(index);
    // check password with confirm password
    if (this.user.password != this.confirmPassword) {
      setTimeout(() => {
        this.clearLoading(index);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Not match password, try again!",
        });
      }, 1000);
      return;
    }

    this.user.fullName = this.user.firstName + " " + this.user.lastName;
    if (this.gender) {
      this.user.gender = this.gender;
    }

    this.userService.register(this.user).subscribe({
      next: (response) => {
        if (response.result == null) {
          setTimeout(() => {
            this.clearLoading(index);
            this.messageService.add({ severity: 'warn', summary: 'Fail', detail: response.message });
          }, 1000);
          return;
        }

        this.user = response.result;
        Swal.fire({
          title: "Success register!",
          text: "You created a account with name" + this.user.fullName,
          icon: "success"
        });
        setTimeout(() => { this.router.navigateByUrl('/auth/login'); this.clearLoading(index); }, 2000);
      },
      error: (err) => {
        setTimeout(() => {
          this.clearLoading(index);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }, 1000);
      },
    });

  }

}
